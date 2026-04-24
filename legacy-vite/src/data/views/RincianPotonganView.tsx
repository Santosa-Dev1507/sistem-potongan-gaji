import React from 'react';
import { Download, Landmark, HelpCircle, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSlipByNip, formatRupiah } from '../data/potonganData';

export function RincianPotonganView() {
  const { user } = useAuth();
  
  const slipData = getSlipByNip(user?.username || '');
  const activePotongan = slipData.potongan.filter(p => p.nominal > 0);
  const totalPotongan = activePotongan.reduce((sum, p) => sum + p.nominal, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
      
      {/* ── Header Slip ── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Daftar Perincian Gaji</p>
          <h3 className="text-2xl md:text-3xl font-black text-primary tracking-tight leading-tight">
            Bulan {slipData.bulan} {slipData.tahun}
          </h3>
          <p className="text-sm text-secondary font-medium mt-0.5">SMP Negeri 5 Klaten</p>
        </div>
        <div className="flex gap-2">
        <button
            disabled
            title="Fitur unduh PDF belum tersedia"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/40 text-white font-bold text-sm rounded-xl cursor-not-allowed min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </section>

      {/* ── Identitas & Gaji Kotor ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Identitas */}
        <div className="p-5 flex items-start justify-between gap-4 border-b border-outline-variant/20">
          <div>
            <p className="text-xs text-secondary font-medium mb-0.5">Nama Pegawai</p>
            <p className="text-lg font-bold text-on-surface leading-snug">{slipData.namaGuru}</p>
            <p className="text-sm font-mono text-secondary mt-1">NIP: {slipData.nip}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Kalkulasi gaji atas */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-on-surface">GAJI KOTOR</p>
            <p className="text-base font-black text-primary">{formatRupiah(slipData.gajiKotor)}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-secondary">
            <p>
              Angs. Bank Jateng
              {slipData.angsuranBankJatengKe ? ` ke-${slipData.angsuranBankJatengKe}` : ''}
            </p>
            <p className="font-semibold text-error">- {formatRupiah(slipData.angsuranBankJateng)}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
            <p className="text-sm font-bold text-on-surface">Masuk Rekening</p>
            <p className="text-lg font-black text-primary">{formatRupiah(slipData.gajiMasukRekening)}</p>
          </div>
        </div>
      </div>

      {/* ── Rincian 18 Potongan ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Label header */}
        <div className="px-5 py-4 bg-error/5 border-b border-error/10 flex justify-between items-center">
          <h4 className="text-sm font-black uppercase tracking-wide text-error">
            Potongan Disetor ke Bendahara
          </h4>
          <span className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full">
            {activePotongan.length} Aktif
          </span>
        </div>

        {/* List potongan */}
        <div className="divide-y divide-outline-variant/10">
          {slipData.potongan.map((item, index) => {
            const isActive = item.nominal > 0;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-5 py-3 gap-3 ${
                  isActive ? '' : 'opacity-40'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="text-xs text-secondary/70 font-mono shrink-0 mt-0.5 w-5 text-right">
                    {index + 1}.
                  </span>
                  <p className="text-sm text-on-surface leading-snug">
                    {item.name}
                    {item.angsuranKe
                      ? <span className="font-semibold text-primary"> ke-{item.angsuranKe}</span>
                      : null}
                  </p>
                </div>
                <p className={`text-sm font-bold shrink-0 ${isActive ? 'text-error' : 'text-secondary'}`}>
                  {isActive ? formatRupiah(item.nominal) : '–'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total footer */}
        <div className="px-5 py-4 border-t-2 border-outline-variant/40 bg-error/5 flex justify-between items-center">
          <p className="text-sm font-black uppercase text-on-surface tracking-wide">Jumlah Potongan</p>
          <p className="text-xl font-black text-error">{formatRupiah(totalPotongan)}</p>
        </div>
      </div>

      {/* ── Info Card ── */}
      <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-on-surface mb-1">Ada ketidaksesuaian?</h4>
          <p className="text-xs text-secondary leading-relaxed">
            Segera hubungi Bendahara SMPN 5 Klaten jika nominal potongan tidak sesuai dengan yang seharusnya.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg transition-all active:scale-95 min-h-[44px] shrink-0">
          <Phone className="w-3.5 h-3.5" />
          Hubungi
        </button>
      </div>

    </div>
  );
}
