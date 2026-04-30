import { NextResponse } from 'next/server';
import { getStatusBayar, updateStatusBayar, getAllSlipsBulan, getSemuaGuru } from '@/lib/sheets';
import { StatusBayarItem } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bulan = searchParams.get('bulan');
  const tahun = parseInt(searchParams.get('tahun') || '', 10);
  const nip = searchParams.get('nip');

  if (!bulan || isNaN(tahun)) {
    return NextResponse.json({ success: false, error: 'Parameter bulan dan tahun diperlukan' }, { status: 400 });
  }

  try {
    const statusMap = await getStatusBayar(bulan, tahun);

    if (nip) {
      // Single user status
      const userStatus = statusMap[nip] || { status: 'BELUM' };
      return NextResponse.json({ success: true, data: userStatus });
    }

    // All users status (for admin)
    const slips = await getAllSlipsBulan(bulan, tahun);
    const gurus = await getSemuaGuru();
    
    // Map existing slips to status
    const data: StatusBayarItem[] = slips.map(slip => {
      // Find total potongan
      const totalPotongan = slip.potongan.reduce((sum, p) => sum + p.nominal, 0);
      const st = statusMap[slip.nip];
      
      return {
        nip: slip.nip,
        nama: slip.namaGuru,
        totalPotongan,
        status: st?.status || 'BELUM',
        tglBayar: st?.tglBayar,
        metode: st?.metode,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[GET /api/pembayaran]', err);
    return NextResponse.json({ success: false, error: 'Gagal membaca status pembayaran' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bulan, tahun, nip, status, metode } = body;

    if (!bulan || !tahun || !nip || !status) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    await updateStatusBayar(bulan, tahun, nip, status, metode);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/pembayaran]', err);
    return NextResponse.json({ success: false, error: 'Gagal update status pembayaran' }, { status: 500 });
  }
}
