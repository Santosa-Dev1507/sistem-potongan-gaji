import { NextResponse } from 'next/server';
import {
  getSemuaGuru,
  getAllSlipsBulan,
  kalkulasiDistribusi,
  getStatusDistribusi,
} from '@/lib/sheets';
import { formatRupiah } from '@/lib/types';

const BULAN_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const bulan = searchParams.get('bulan') || BULAN_ID[now.getMonth()];
  const tahun = parseInt(searchParams.get('tahun') || String(now.getFullYear()));

  try {
    const [guru, slips, distribusi, statusMap] = await Promise.all([
      getSemuaGuru(),
      getAllSlipsBulan(bulan, tahun),
      kalkulasiDistribusi(bulan, tahun),
      getStatusDistribusi(bulan, tahun),
    ]);

    // Hitung total potongan bulan ini
    let totalPotongan = 0;
    slips.forEach(slip => {
      slip.potongan.forEach(p => {
        totalPotongan += p.nominal;
      });
    });

    // Kalkulasi distribusi
    const aktifDistribusi = distribusi.filter(d => d.totalDana > 0);
    const instansiTujuan = aktifDistribusi.length;
    let totalTerkumpul = 0;
    let totalDisetor = 0;
    let instansiBelumSetor = 0;

    aktifDistribusi.forEach(d => {
      totalTerkumpul += d.totalDana;
      const status = statusMap[d.instansi]?.status || 'BELUM_DISETOR';
      if (status === 'SUDAH_DISETOR') {
        totalDisetor += d.totalDana;
      } else {
        instansiBelumSetor++;
      }
    });

    const belumDisetor = totalTerkumpul - totalDisetor;

    // Persentase belum disetor
    const persenBelum = totalTerkumpul > 0 ? Math.round((belumDisetor / totalTerkumpul) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: [
          {
            label: 'Total Potongan',
            value: formatRupiah(totalPotongan),
            sub: slips.length > 0 ? 'Data bulan ini' : 'Belum ada data',
            subBg: slips.length > 0 ? 'bg-primary-container' : 'bg-surface-container',
            subText: slips.length > 0 ? 'text-on-primary-container' : 'text-secondary',
            icon: 'Receipt',
            iconBg: 'bg-error-container',
            iconText: 'text-error',
            special: false
          },
          {
            label: 'Instansi Tujuan',
            value: `${instansiTujuan} Mitra`,
            sub: 'Aktif menerima dana',
            subBg: 'bg-surface-container',
            subText: 'text-secondary',
            icon: 'Banknote',
            iconBg: 'bg-primary-fixed',
            iconText: 'text-primary',
            special: false
          },
          {
            label: 'Belum Disetor',
            value: formatRupiah(belumDisetor),
            sub: `${persenBelum}% dari total terkumpul`,
            subBg: '',
            subText: '',
            icon: 'Wallet',
            iconBg: 'bg-white/20',
            iconText: 'text-white',
            special: true
          },
          {
            label: 'Guru Diproses',
            value: `${slips.length} / ${guru.length}`,
            sub: slips.length === guru.length ? 'Semua sinkron' : 'Belum semua sinkron',
            subBg: slips.length === guru.length ? 'bg-tertiary-fixed' : 'bg-error-container',
            subText: slips.length === guru.length ? 'text-on-tertiary-fixed' : 'text-on-error-container',
            icon: 'UserCheck',
            iconBg: 'bg-secondary-fixed',
            iconText: 'text-on-secondary-fixed',
            special: false
          }
        ],
        penyaluran: {
          belumSetor: instansiBelumSetor,
          totalInstansi: instansiTujuan,
          bulanLabel: `${bulan} ${tahun}`
        }
      }
    });
  } catch (err) {
    console.error('[GET /api/dashboard]', err);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat data dashboard' },
      { status: 500 }
    );
  }
}
