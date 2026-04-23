import React from 'react';
import { Landmark, Printer, AlertCircle, Building2, Filter } from 'lucide-react';

export function DistribusiPotonganView() {
  const providers = [
    { name: 'Koperasi Narasoma', type: 'Koperasi Pokok & Angsuran', members: 42, amount: 'Rp 14.500.000', status: 'Belum Disetor', bg: 'bg-primary/10', text: 'text-primary' },
    { name: 'Koperasi Bahtera', type: 'Koperasi Pokok & Angsuran', members: 38, amount: 'Rp 11.350.000', status: 'Sudah Disetor', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
    { name: 'BAZNAS', type: 'Zakat & Sodaqoh', members: 45, amount: 'Rp 4.200.000', status: 'Sudah Disetor', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
    { name: 'Beras Srinuk (Bulog)', type: 'Kebutuhan Pokok', members: 45, amount: 'Rp 6.750.000', status: 'Belum Disetor', bg: 'bg-error/10', text: 'text-error' },
    { name: 'PGRI & Danpen', type: 'Organisasi', members: 45, amount: 'Rp 1.451.250', status: 'Belum Disetor', bg: 'bg-warning/10', text: 'text-warning' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface">Distribusi Tagihan Potongan</h2>
          <p className="text-secondary text-sm mt-1">Laporan rekapitulasi total dana yang harus disetorkan bendahara ke Instansi Pihak Ketiga</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-low transition-all border border-outline-variant/30 min-h-[44px]">
            <Filter className="w-4 h-4" />
            Bulan: April 2026
          </button>
          <button
            disabled
            title="Fitur cetak belum tersedia"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary/40 text-white font-bold text-sm rounded-xl cursor-not-allowed min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            Cetak Rekap
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-surface-container p-6 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Total Dana Terkumpul</p>
          <h3 className="text-2xl font-black text-primary">Rp 45.600.000</h3>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Telah Disetorkan</p>
          <h3 className="text-2xl font-black text-tertiary">Rp 15.550.000</h3>
        </div>
        <div className="bg-error-container p-6 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-on-error-container mb-2">Dana Tertahan / Belum Setor</p>
          <h3 className="text-2xl font-black text-error">Rp 30.050.000</h3>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Jumlah Mitra Tujuan</p>
          <h3 className="text-2xl font-black text-on-surface">15 Mitra</h3>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
          <h3 className="font-bold text-on-surface">Rincian Mitra Penyaluran</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Instansi / Pihak Ke-3</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Jml Penyetor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary text-right">Total Dana</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary text-center">Status Setor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {providers.map((p, i) => (
                <tr key={i} className="hover:bg-primary-fixed/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center ${p.text}`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-primary">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">{p.type}</td>
                  <td className="px-6 py-5 text-sm font-bold">{p.members} Org</td>
                  <td className="px-6 py-5 text-right font-black text-primary">{p.amount}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'Sudah Disetor' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error/10 text-error'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-primary-container p-5 md:p-6 rounded-2xl flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
        <div className="flex items-start gap-4">
           <AlertCircle className="w-7 h-7 text-on-primary-container shrink-0 mt-0.5" />
           <div>
             <h4 className="font-bold text-on-primary-container">3 Instansi Belum Menerima Setoran</h4>
             <p className="text-sm text-on-primary-container/80 mt-1">Koperasi Narasoma, Beras Srinuk, dan PGRI. Harap selesaikan sebelum tanggal 10.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
