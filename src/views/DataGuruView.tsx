import React from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeacherTableRow } from '../components/TeacherTableRow';

export function DataGuruView() {
  const teachers = [
    { nip: '198204152009031004', name: 'Agus Mardani, S.Pd.',    dept: 'IPA',          totalTagihan: 'Rp 1.320.000', jumlahPotongan: 9,  dsrRatio: '', dsrStatus: '', init: 'AM', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { nip: '197509121998022001', name: 'Siti Rahayu, M.Pd.',      dept: 'Matematika',   totalTagihan: 'Rp 2.100.000', jumlahPotongan: 12, dsrRatio: '', dsrStatus: '', init: 'SR', bg: 'bg-tertiary-fixed',      text: 'text-on-tertiary-fixed' },
    { nip: '199002282015042003', name: 'Budi Prasetyo, S.Kom.',   dept: 'TI & Multimedia', totalTagihan: 'Rp 1.900.000', jumlahPotongan: 11, dsrRatio: '', dsrStatus: '', init: 'BP', bg: 'bg-primary-fixed',  text: 'text-on-primary-fixed' },
    { nip: '198811052012121002', name: 'Dewi Indah, S.S.',        dept: 'Bahasa',       totalTagihan: 'Rp 543.000',   jumlahPotongan: 6,  dsrRatio: '', dsrStatus: '', init: 'DI', bg: 'bg-secondary-fixed',    text: 'text-on-secondary-fixed' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search & Actions */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest rounded-xl border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary transition-all text-sm min-h-[44px]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/20 hover:bg-surface-container-low transition-all min-h-[44px]">
            <Filter className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Semua</span>
          </button>
        </div>
        {/* "Tambah Guru" disimpan tapi ditandai coming soon — fungsionalitas belum ada */}
        <button
          disabled
          title="Fitur belum tersedia"
          className="flex items-center gap-2 px-6 py-3 bg-primary/40 text-white rounded-xl font-semibold cursor-not-allowed text-sm min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Tambah Guru
        </button>
      </section>

      {/* Teacher Table */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-5 md:px-8 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">NIP</th>
                <th className="px-5 md:px-8 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Nama Guru</th>
                <th className="px-5 md:px-8 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Total Tagihan</th>
                <th className="px-5 md:px-8 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">Jml. Aktif</th>
                <th className="px-5 md:px-8 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {teachers.map((t) => (
                <TeacherTableRow key={t.nip} teacher={t} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 md:px-8 py-4 bg-surface-container-low flex items-center justify-between">
          <p className="text-xs font-medium text-secondary">Menampilkan 1–4 dari 84 Guru</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white rounded-lg text-outline transition-all disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-white text-secondary text-xs font-bold">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-white text-secondary text-xs font-bold">3</button>
            <button className="p-2 hover:bg-white rounded-lg text-secondary transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
