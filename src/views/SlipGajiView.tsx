import React from 'react';
import { Share2, Download, Banknote, GraduationCap, Users, Coffee, Landmark, Info } from 'lucide-react';
import { PayrollItemCard } from '../components/PayrollItemCard';
import { NetPayHighlight } from '../components/NetPayHighlight';

export function SlipGajiView() {
  const incomes = [
    { title: 'Gaji Pokok', subtitle: 'Bulanan Tetap', value: 'Rp 4.250.000', icon: Banknote, iconBgClass: 'bg-primary/10', iconTextClass: 'text-primary' },
    { title: 'Tunjangan Sertifikasi', subtitle: 'Profesional Tingkat 2', value: 'Rp 1.500.000', icon: GraduationCap, iconBgClass: 'bg-primary/5', iconTextClass: 'text-primary' },
    { title: 'Tunjangan Keluarga', subtitle: 'Istri & 2 Anak', value: 'Rp 425.000', icon: Users, iconBgClass: 'bg-primary/10', iconTextClass: 'text-primary' },
    { title: 'Tunjangan Makan', subtitle: '22 Hari Aktif', value: 'Rp 550.000', icon: Coffee, iconBgClass: 'bg-primary/5', iconTextClass: 'text-primary' },
  ];

  const deductions = [
    { label: 'PPh 21 (Pajak Penghasilan)', val: 'Rp 124.500' },
    { label: 'BPJS Kesehatan', val: 'Rp 85.000' },
    { label: 'Dana Pensiun (BPJS TK)', val: 'Rp 170.000' },
    { label: 'Koperasi Guru', val: 'Rp 100.000' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12 space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          <p className="label-md uppercase tracking-[0.2em] text-secondary font-bold text-xs">Pernyataan Pembayaran</p>
          <h3 className="text-5xl font-black text-primary tracking-tighter">September 2023</h3>
          <p className="text-secondary max-w-md">Rincian kompensasi institusional untuk layanan pendidikan yang diberikan di SMPN 5 Klaten.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-high transition-all active:scale-95">
            <Share2 className="w-5 h-5" />
            Bagikan
          </button>
          <button className="flex items-center gap-3 px-8 py-3 salary-pulse-gradient text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
            <Download className="w-5 h-5" />
            Unduh Slip PDF
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Gross Income */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">RINCIAN PENDAPATAN KOTOR</h4>
              <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full">{incomes.length} Item</span>
            </div>
            <div className="space-y-4">
              {incomes.map((inc, i) => (
                <PayrollItemCard
                  key={i}
                  variant="income"
                  title={inc.title}
                  subtitle={inc.subtitle}
                  value={inc.value}
                  icon={inc.icon}
                  iconBgClass={inc.iconBgClass}
                  iconTextClass={inc.iconTextClass}
                  hasBg={i % 2 === 0}
                />
              ))}
            </div>
            <div className="pt-6 border-t border-surface-container flex justify-between items-center px-6">
              <p className="text-sm font-black uppercase text-secondary">TOTAL KOTOR</p>
              <p className="text-2xl font-black text-primary">Rp 6.725.000</p>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-error">POTONGAN WAJIB</h4>
              <span className="px-3 py-1 bg-error/5 text-error text-[10px] font-bold rounded-full">Pajak & Asuransi</span>
            </div>
            <div className="space-y-1">
              {deductions.map((d, i) => (
                <PayrollItemCard
                  key={i}
                  variant="deduction"
                  title={d.label}
                  value={d.val}
                />
              ))}
            </div>
            <div className="pt-6 border-t border-surface-container flex justify-between items-center px-6">
              <p className="text-sm font-black uppercase text-secondary">TOTAL POTONGAN</p>
              <p className="text-lg font-black text-error">- Rp 479.500</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Take Home Pay */}
          <NetPayHighlight
            value="Rp 6.245.500"
            valueInWords="ENAM JUTA DUA RATUS EMPAT PULUH LIMA RIBU LIMA RATUS RUPIAH"
            trendText="Tren: +2.4% vs bulan lalu"
            chartHeights={[8, 10, 7, 12, 9, 14]}
          />

          {/* Attendance */}
          <div className="bg-surface-container-low rounded-3xl p-8 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">REKAM LAYANAN</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl text-center space-y-1">
                <p className="text-2xl font-black text-primary">22</p>
                <p className="text-[10px] font-bold uppercase text-secondary">HARI KERJA</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl text-center space-y-1">
                <p className="text-2xl font-black text-primary">100%</p>
                <p className="text-[10px] font-bold uppercase text-secondary">KEHADIRAN</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-secondary">Jam Mengajar</span>
                <span className="text-xs font-bold">36j / Minggu</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[90%]"></div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-primary-container rounded-3xl p-8 text-on-primary-container">
            <div className="flex items-center gap-4 mb-6">
              <Landmark className="w-8 h-8" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container/60">BANK PENYALURAN</p>
                <p className="text-sm font-bold">Bank Jateng</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-on-primary-container/10 pt-6">
              <p className="text-[10px] font-medium opacity-60">Pemilik Rekening</p>
              <p className="text-sm font-bold tracking-tight">BUDI PRASETYO, S.PD.</p>
              <p className="text-lg font-black tracking-widest mt-2">**** **** 8829</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-12 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-[11px] text-secondary font-medium leading-relaxed max-w-xl">
            Ini adalah slip gaji yang dibuat oleh komputer dan tidak memerlukan tanda tangan fisik. Untuk setiap ketidaksesuaian, silakan hubungi Kantor Administrasi dalam waktu 3 hari kerja sejak tanggal pembayaran.
          </p>
        </div>
        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">ID Ref: SMPN5-SEP23-TR092</p>
      </footer>
    </div>
  );
}
