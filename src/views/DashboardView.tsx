import React from 'react';
import { Banknote, Receipt, Wallet, UserCheck, Upload, CheckCircle, Edit2, AlertTriangle, History } from 'lucide-react';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { RecentActivityList } from '../components/RecentActivityList';

export function DashboardView() {
  const activities = [
    { icon: Upload, bg: 'bg-secondary-container', text: 'text-on-secondary-container', title: 'File Tagihan Bank Jateng Diimpor', time: '2 jam lalu • tagihan_bpd_apr26.xlsx' },
    { icon: CheckCircle, bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed', title: 'Potongan diverifikasi untuk 42 Guru', time: '5 jam lalu • Kelompok A' },
    { icon: Edit2, bg: 'bg-primary-fixed', text: 'text-on-primary-fixed', title: 'Iuran Koperasi Diubah: Drs. Hartono', time: 'Kemarin • Penutupan pinjaman' },
    { icon: AlertTriangle, bg: 'bg-error-container', text: 'text-on-error-container', title: 'Nominal Potongan BAZNAS Diubah', time: 'Kemarin • Sri Juwariyah' },
    { icon: History, bg: 'bg-secondary-container', text: 'text-on-secondary-container', title: 'Rekapitulasi Maret 2026 Selesai', time: '2 hari lalu • Oleh Admin' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Bento Grid Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <DashboardStatCard
          title="Total Potongan"
          value="Rp 45.6Jt"
          icon={Receipt}
          iconBgClass="bg-error-container"
          iconTextClass="text-error"
          trendValue="+2.4%"
          trendBgClass="bg-error-container"
          trendTextClass="text-on-error-container"
          trendText="dari bulan lalu"
        />

        <DashboardStatCard
          title="Instansi Tujuan"
          value="15 Mitra"
          icon={Banknote}
          iconBgClass="bg-primary-fixed"
          iconTextClass="text-primary"
          trendValue="Tetap"
          trendBgClass="bg-surface-container"
          trendTextClass="text-secondary"
          trendText="tidak ada mitra baru"
        />

        <DashboardStatCard
          title="Belum Disetor"
          value="Rp 30Jt"
          icon={Wallet}
          iconBgClass="bg-white/20"
          iconTextClass="text-white"
          trendValue=""
          trendBgClass=""
          trendTextClass=""
          trendText=""
          isSpecial={true}
          specialProgress={65}
        />

        <DashboardStatCard
          title="Guru Diproses"
          value="84 / 84"
          icon={UserCheck}
          iconBgClass="bg-secondary-fixed"
          iconTextClass="text-on-secondary-fixed"
          trendValue="100%"
          trendBgClass="bg-tertiary-fixed"
          trendTextClass="text-on-tertiary-fixed"
          trendText="semua data sinkron"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-base font-bold text-on-surface">Tren Potongan Bulanan</h3>
                <p className="text-xs text-secondary">Tahun Ajaran 2025/2026</p>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-error"></span> Koperasi
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase tracking-tight ml-2">
                  <span className="w-2 h-2 rounded-full bg-outline"></span> Lainnya
                </span>
              </div>
            </div>

            {/* Simulated Chart */}
            <div className="flex items-end justify-between h-40 md:h-48 gap-2 md:gap-4 px-2 md:px-4">
              {[
                { m: 'OKT', h1: '60%', h2: '40%' },
                { m: 'NOV', h1: '65%', h2: '35%' },
                { m: 'DES', h1: '50%', h2: '30%' },
                { m: 'JAN', h1: '70%', h2: '50%' },
                { m: 'FEB', h1: '55%', h2: '45%' },
                { m: 'MAR', h1: '80%', h2: '60%', active: true },
                { m: 'APR', h1: '85%', h2: '65%', current: true },
              ].map((d) => (
                <div key={d.m} className="flex-1 group flex flex-col items-center gap-2">
                  <div className="w-full flex gap-0.5 md:gap-1 h-full items-end">
                    <div className={`flex-1 rounded-t-sm transition-all ${d.current ? 'bg-primary' : 'bg-outline-variant/30 group-hover:bg-primary-fixed'}`} style={{ height: d.h1 }}></div>
                    <div className={`flex-1 rounded-t-sm transition-all ${d.current ? 'bg-error' : 'bg-error/40 group-hover:bg-error'}`} style={{ height: d.h2 }}></div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-bold ${d.current ? 'text-primary font-black' : 'text-secondary'}`}>{d.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan distribusi */}
          <div className="bg-surface-container p-5 md:p-6 rounded-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Status Penyaluran Bulan Ini</h4>
                <p className="text-xl font-black text-on-surface">3 dari 15 Instansi</p>
                <p className="text-xs text-secondary mt-1">Belum menerima setoran bulan April 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <RecentActivityList activities={activities} />
        </section>
      </div>
    </div>
  );
}
