import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const records = [
  { month: 'April 2026', id: 'POT-2026-04', totalPotongan: 45600000, status: 'DIPROSES' as const },
  { month: 'Maret 2026', id: 'POT-2026-03', totalPotongan: 44100000, status: 'SELESAI' as const },
  { month: 'Februari 2026', id: 'POT-2026-02', totalPotongan: 44900000, status: 'SELESAI' as const },
  { month: 'Januari 2026', id: 'POT-2026-01', totalPotongan: 43500000, status: 'SELESAI' as const },
];

type Status = 'DIPROSES' | 'SELESAI' | 'TERTUNDA';

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: typeof CheckCircle }> = {
  SELESAI:  { label: 'Selesai',  bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed',       icon: CheckCircle },
  DIPROSES: { label: 'Diproses', bg: 'bg-primary-fixed',       text: 'text-primary',                 icon: Clock },
  TERTUNDA: { label: 'Tertunda', bg: 'bg-secondary-container', text: 'text-on-secondary-container',  icon: AlertCircle },
};

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export function RiwayatPotonganView() {
  const navigate = useNavigate();

  // Ambil hanya bulan lalu (record ke-2, index 1)
  const bulanLalu = records[1];
  const cfg = statusConfig[bulanLalu.status];
  const Icon = cfg.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="mb-2">
        <p className="text-xs text-secondary font-medium uppercase tracking-widest">Potongan Bulan Lalu</p>
        <h3 className="text-2xl font-black text-on-surface">{bulanLalu.month}</h3>
      </div>

      {/* Kartu utama bulan lalu */}
      <button
        onClick={() => navigate('/rincian')}
        className="w-full text-left bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-5 hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-primary text-base leading-snug">{bulanLalu.month}</p>
              <p className="text-[11px] text-secondary font-mono mt-0.5"># {bulanLalu.id}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${cfg.bg} ${cfg.text}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>

        <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
          <p className="text-sm text-secondary font-medium">Total Potongan Disetor</p>
          <p className="font-black text-xl text-error">{formatRupiah(bulanLalu.totalPotongan)}</p>
        </div>

        <p className="text-xs text-primary font-semibold mt-3 text-right underline underline-offset-2">
          Lihat Rincian →
        </p>
      </button>

      {/* Info keterangan */}
      <p className="text-xs text-secondary text-center pt-2">
        Untuk riwayat lebih lanjut, hubungi Bendahara SMPN 5 Klaten.
      </p>
    </div>
  );
}
