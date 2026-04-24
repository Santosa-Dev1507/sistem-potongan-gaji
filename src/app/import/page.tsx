'use client';

import { useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { CloudUpload, Paperclip, FileSpreadsheet, Download, CheckSquare, X, Info } from 'lucide-react';
import { POTONGAN_KEYS } from '@/lib/types';

interface PreviewRow {
  nip: string;
  nama: string;
  gajiKotor: string;
  angsBankJateng: string;
}

export default function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    // Simulasi preview (parsing butuh SheetJS — tersedia setelah install `xlsx`)
    setPreview([
      { nip: '198204152009031004', nama: 'Agus Mardani, S.Pd.',  gajiKotor: '4.500.000', angsBankJateng: '500.000' },
      { nip: '197509121998022001', nama: 'Siti Rahayu, M.Pd.',    gajiKotor: '5.200.000', angsBankJateng: '750.000' },
      { nip: '199002282015042003', nama: 'Budi Prasetyo, S.Kom.', gajiKotor: '4.800.000', angsBankJateng: '0' },
    ]);
  };

  const downloadTemplate = () => {
    // Buat header CSV template
    const headers = [
      'NIP', 'NAMA_GURU', 'GAJI_KOTOR', 'ANGS_BANK_JATENG', 'ANGS_KE', 'MASUK_REKENING',
      ...POTONGAN_KEYS.map((p) => `NOMINAL_${p.id.toUpperCase()}`),
      ...POTONGAN_KEYS.map((p) => `ANGSURAN_KE_${p.id.toUpperCase()}`),
    ];
    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_potongan_smpn5.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Drop Zone */}
        <section
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className={`p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-colors ${dragOver ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/50 bg-surface-container-low hover:border-primary/30'}`}
        >
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <CloudUpload className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              {fileName ? `✓ ${fileName}` : 'Unggah Spreadsheet Tagihan'}
            </h3>
            <p className="text-secondary max-w-sm mx-auto mt-2 text-sm leading-relaxed">
              Seret & lepas file CSV atau Excel ke sini, atau klik tombol di bawah.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 salary-pulse-gradient text-white rounded-xl font-semibold shadow-lg shadow-primary/20 min-h-[44px] active:scale-95 transition-all"
            >
              <Paperclip className="w-4 h-4" />
              Pilih File
            </button>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest text-on-surface rounded-xl font-semibold hover:bg-surface-container transition-all text-sm border border-outline-variant/20 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              Unduh Template
            </button>
          </div>
        </section>

        {/* Preview */}
        {preview.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Pratinjau Data
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-full ml-2">{preview.length} BARIS</span>
              </h3>
              <button onClick={() => { setPreview([]); setFileName(''); }} className="p-2 text-secondary hover:bg-surface-container rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['NIP', 'Nama Guru', 'Gaji Kotor', 'Angs. Bank Jateng'].map((h) => (
                        <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {preview.map((row) => (
                      <tr key={row.nip} className="hover:bg-primary-fixed/20 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-secondary">{row.nip}</td>
                        <td className="px-5 py-4 font-semibold text-on-surface text-sm">{row.nama}</td>
                        <td className="px-5 py-4 font-bold text-primary text-sm">Rp {row.gajiKotor}</td>
                        <td className="px-5 py-4 text-sm text-error font-semibold">Rp {row.angsBankJateng}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="w-full py-4 salary-pulse-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 min-h-[52px] active:scale-[0.99] transition-all">
              <CheckSquare className="w-5 h-5" />
              Validasi & Simpan ke Google Sheets
            </button>
          </section>
        )}

        {/* Tips */}
        <div className="p-5 bg-tertiary-fixed/10 rounded-2xl flex gap-4 items-start">
          <Info className="w-6 h-6 text-tertiary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-tertiary">Panduan Format File</p>
            <p className="text-[11px] text-on-tertiary-fixed-variant mt-1 leading-relaxed">
              Unduh template CSV di atas untuk melihat urutan kolom yang benar. Kolom wajib: NIP, NAMA_GURU, GAJI_KOTOR, MASUK_REKENING, dan 18 kolom nominal potongan.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
