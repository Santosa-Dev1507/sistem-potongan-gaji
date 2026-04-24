import React from 'react';
import { CloudUpload, Paperclip, Table, Link as LinkIcon, CheckSquare, Info } from 'lucide-react';

export function ImportGajiView() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="bg-surface-container-low p-10 rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/30 transition-colors">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
          <CloudUpload className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">Unggah Spreadsheet Gaji</h3>
          <p className="text-secondary max-w-sm mx-auto mt-2 text-sm leading-relaxed">
            Tarik dan lepas file Excel (.xlsx) atau CSV Anda di sini. Pastikan kolom mengikuti format standar buku kas akademik.
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Pilih File
          </button>
          <button className="px-6 py-3 bg-surface-container-lowest text-on-surface rounded-xl font-semibold hover:bg-surface-container transition-all text-sm border border-outline-variant/10">
            Unduh Templat
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Table className="w-5 h-5" />
              Pratinjau & Pemetaan
            </h3>
            <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-full uppercase tracking-tighter">4 BARIS TERDETEKSI</span>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">ID GURU</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">NAMA LENGKAP</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">GAJI KOTOR</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">KOLOM G (BELUM DIPETAKAN)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-surface-container-low hover:bg-primary-fixed/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">SMP-1092</td>
                  <td className="px-6 py-4 font-semibold">Drs. Bambang Wijaya</td>
                  <td className="px-6 py-4 text-primary font-bold">Rp 4.500.000</td>
                  <td className="px-6 py-4 italic text-secondary">Nilai: 150.000</td>
                </tr>
                <tr className="bg-surface-container-low/30 border-b border-surface-container-low hover:bg-primary-fixed/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">SMP-1104</td>
                  <td className="px-6 py-4 font-semibold">Siti Aminah, S.Pd.</td>
                  <td className="px-6 py-4 text-primary font-bold">Rp 4.250.000</td>
                  <td className="px-6 py-4 italic text-secondary">Nilai: 125.000</td>
                </tr>
                <tr className="border-b border-surface-container-low hover:bg-primary-fixed/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">SMP-1115</td>
                  <td className="px-6 py-4 font-semibold">Rahmat Hidayat, M.Si.</td>
                  <td className="px-6 py-4 text-primary font-bold">Rp 5.100.000</td>
                  <td className="px-6 py-4 italic text-secondary">Nilai: 200.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Pemetaan Kolom
          </h3>
          
          <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary">PEMETAAN UNTUK 'KOLOM G'</label>
              <select defaultValue="" className="w-full bg-surface-container-highest border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                <option value="" disabled>Pilih Jenis Potongan...</option>
                <option value="koperasi">Potongan Koperasi</option>
                <option value="bpjs">Iuran BPJS Kesehatan</option>
                <option value="pensiun">Iuran Pensiun</option>
                <option value="pajak">Pajak PPh 21</option>
                <option value="sosial">Iuran Sosial Sekolah</option>
              </select>
            </div>
            
            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary">ATURAN POTONGAN</label>
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-xs leading-relaxed text-on-surface-variant">
                Nilai di <span className="font-bold text-error">Kolom G</span> akan dikurangi dari <span className="font-bold text-primary">Gaji Kotor</span> dan dicatat sebagai <span className="italic">Penyesuaian Manual</span>.
              </div>
            </div>
            
            <div className="pt-6 space-y-3">
              <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group">
                <CheckSquare className="w-5 h-5" />
                Validasi & Impor
              </button>
              <p className="text-center text-[10px] text-secondary uppercase tracking-tight">SISTEM AKAN MEMVERIFIKASI ID GURU SEBELUM FINALISASI</p>
            </div>
          </div>

          <div className="p-6 bg-tertiary-fixed/10 rounded-2xl flex gap-4 items-start">
            <Info className="w-6 h-6 text-tertiary shrink-0" />
            <div>
              <p className="text-xs font-bold text-tertiary leading-tight">Tips Pro: Tindakan Massal</p>
              <p className="text-[11px] text-on-tertiary-fixed-variant mt-1">Jika file memiliki beberapa kolom yang belum dipetakan, Anda dapat menentukan aturan pemetaan global di panel pengaturan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
