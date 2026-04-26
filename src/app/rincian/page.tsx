'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import AppShell from '@/components/AppShell';
import { SlipPotongan, formatRupiah } from '@/lib/types';
import { Download, Landmark, HelpCircle } from 'lucide-react';

export default function RincianPage() {
  const { user } = useAuth();
  const [slip, setSlip] = useState<SlipPotongan | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    // Gunakan array bulan statis agar tidak bergantung pada locale OS
    const BULAN_ID = [
      'Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'
    ];
    const currIndex = now.getMonth();
    const bulan = BULAN_ID[currIndex];
    const tahun = now.getFullYear();

    // Hitung bulan sebelumnya
    let prevIndex = currIndex - 1;
    let prevTahun = tahun;
    if (prevIndex < 0) {
      prevIndex = 11;
      prevTahun -= 1;
    }
    const prevBulan = BULAN_ID[prevIndex];

    const url = `/api/slip?nip=${user.username}&bulan=${bulan}&tahun=${tahun}`;
    const urlPrev = `/api/slip?nip=${user.username}&bulan=${prevBulan}&tahun=${prevTahun}`;
    console.log('[rincian] fetch curr:', url, 'prev:', urlPrev);

    // Buat fallback dari data sesi — potongan kosong (belum ada data di sheet)
    const fallback: SlipPotongan = {
      id: `${user.username}-${bulan}-${tahun}`,
      nip: user.username,
      namaGuru: user.namaGuru || `NIP: ${user.username}`,
      bulan,
      tahun,
      gajiKotor: 0,
      potongan: [],
    };

    Promise.all([
      fetch(url).then((r) => r.json()),
      fetch(urlPrev).then((r) => r.json()).catch(() => ({ success: false })),
    ])
      .then(([jsonCurr, jsonPrev]) => {
        console.log('[rincian] response curr:', jsonCurr);
        if (jsonCurr.success && jsonCurr.data) {
          const finalSlip = jsonCurr.data as SlipPotongan;

          // Komparasi dengan bulan sebelumnya jika ada
          if (jsonPrev.success && jsonPrev.data) {
            const prevPotongan = jsonPrev.data.potongan as SlipPotongan['potongan'];
            finalSlip.potongan = finalSlip.potongan.map((curr) => {
              // Cari berdasarkan ID instansi (atau name sebagai fallback)
              const prev = prevPotongan.find((p) => p.id === curr.id || p.name === curr.name);
              if (prev) {
                if (curr.nominal !== prev.nominal) {
                  return { ...curr, selisih: curr.nominal - prev.nominal };
                }
              } else if (curr.nominal > 0) {
                // Item ini tidak ada di bulan lalu atau nilainya 0, tapi sekarang ada isinya
                return { ...curr, isBaru: true };
              }
              return curr;
            });
          }
          setSlip(finalSlip);
        } else {
          setSlip(fallback);
        }
      })
      .catch((err) => {
        console.error('[rincian] fetch error:', err);
        setSlip(fallback);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const activePotongan = slip?.potongan.filter((p) => p.nominal > 0) ?? [];
  const totalPotongan = activePotongan.reduce((s, p) => s + p.nominal, 0);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-5">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Daftar Perincian</p>
            <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight">
              Bulan {slip?.bulan ?? '—'} {slip?.tahun ?? ''}
            </h3>
            <p className="text-sm text-secondary font-medium mt-0.5">SMP Negeri 5 Klaten</p>
          </div>
          <button
            onClick={handlePrint}
            disabled={!slip}
            title="Unduh sebagai PDF"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl min-h-[44px] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed print:hidden"
          >
            <Download className="w-4 h-4" />
            Unduh PDF
          </button>
        </section>

        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center text-secondary text-sm">Memuat data slip...</div>
        )}

        {!loading && slip && (
          <>
            {/* Identitas Pegawai */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-secondary font-medium mb-0.5">Nama Pegawai</p>
                <p className="text-lg font-bold text-on-surface">{slip.namaGuru}</p>
                <p className="text-sm font-mono text-secondary mt-1">NIP: {slip.nip}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
            </div>

            {/* Total Potongan & Rincian */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-5 py-4 bg-error/5 border-b border-error/10 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-error mb-1">Total Potongan</h4>
                  <p className="text-2xl font-black text-error">{formatRupiah(totalPotongan)}</p>
                </div>
                <span className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full text-center">
                  {activePotongan.length}<br/>Aktif
                </span>
              </div>

              <div className="divide-y divide-outline-variant/10">
                {slip.potongan.map((item, idx) => {
                  const aktif = item.nominal > 0;
                  return (
                    <div key={item.id} className={`flex items-center justify-between px-5 py-3 gap-3 ${aktif ? '' : 'opacity-35'}`}>
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-xs text-secondary/60 font-mono shrink-0 mt-0.5 w-5 text-right">{idx + 1}.</span>
                        <div className="min-w-0 flex flex-col items-start">
                          <p className={`text-sm ${item.selisih !== undefined || item.isBaru ? 'font-bold text-error' : 'text-on-surface'}`}>{item.name}</p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {item.angsuranKe && (
                              <span className="inline-block px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full">
                                Angsuran ke-{item.angsuranKe}
                              </span>
                            )}
                            {item.isBaru && (
                              <span className="inline-block px-2 py-0.5 bg-tertiary text-white text-[10px] font-bold rounded-full">
                                Baru
                              </span>
                            )}
                            {item.selisih !== undefined && (
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${item.selisih > 0 ? 'bg-error/10 text-error' : 'bg-[#25D366]/10 text-[#25D366]'}`}>
                                {item.selisih > 0 ? 'Naik' : 'Turun'} {formatRupiah(Math.abs(item.selisih))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${aktif ? (item.selisih !== undefined || item.isBaru ? 'text-error' : 'text-on-surface') : 'text-secondary'}`}>
                          {aktif ? formatRupiah(item.nominal) : '–'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kalkulasi Gaji Bersih */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-secondary">Gaji Kotor</p>
                  <p className="text-base font-bold text-on-surface">{formatRupiah(slip.gajiKotor)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-secondary">Potongan</p>
                  <p className="text-base font-bold text-error">− {formatRupiah(totalPotongan)}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-outline-variant/30">
                  <div>
                    <p className="text-sm font-black uppercase text-primary">Gaji Bersih</p>
                    <p className="text-[10px] font-bold text-secondary mt-0.5">MASUK REKENING</p>
                  </div>
                  <p className="text-xl font-black text-primary">{formatRupiah(slip.gajiKotor - totalPotongan)}</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-on-surface mb-1">Ada ketidaksesuaian?</h4>
                <p className="text-xs text-secondary leading-relaxed">Hubungi Bendahara SMPN 5 Klaten jika nominal tidak sesuai.</p>
              </div>
              <a
                href="https://wa.me/6285879652335?text=Assalamu'alaikum%2C%20saya%20ingin%20menanyakan%20slip%20potongan%20gaji%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-lg min-h-[44px] shrink-0 active:scale-95 transition-all print:hidden"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hubungi
              </a>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
