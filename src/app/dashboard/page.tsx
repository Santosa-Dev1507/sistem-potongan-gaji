'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { Receipt, Banknote, Wallet, UserCheck, Upload, CheckCircle, Edit2, AlertTriangle, History, Loader, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { ElementType } from 'react';
const IconMap: Record<string, ElementType> = { Receipt, Banknote, Wallet, UserCheck };

const activities = [
  { icon: Upload,        bg: 'bg-secondary-container', text: 'text-on-secondary-container', title: 'File Tagihan Bank Jateng Diimpor',     time: '2 jam lalu • tagihan_bpd_apr26.xlsx' },
  { icon: CheckCircle,  bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed',       title: 'Potongan diverifikasi untuk 42 Guru', time: '5 jam lalu • Kelompok A' },
  { icon: Edit2,        bg: 'bg-primary-fixed',        text: 'text-on-primary-fixed',        title: 'Iuran Koperasi Diubah: Drs. Hartono', time: 'Kemarin • Penutupan pinjaman' },
  { icon: AlertTriangle, bg: 'bg-error-container',     text: 'text-on-error-container',      title: 'Nominal BAZNAS Diubah',              time: 'Kemarin • Sri Juwariyah' },
  { icon: History,      bg: 'bg-secondary-container',  text: 'text-on-secondary-container',  title: 'Rekapitulasi Maret 2026 Selesai',    time: '2 hari lalu • Oleh Admin' },
];

const stats = [
  { label: 'Total Potongan',  value: 'Rp 45.6Jt', sub: '+2.4% dari bulan lalu', subBg: 'bg-error-container',    subText: 'text-on-error-container', Icon: Receipt,   iconBg: 'bg-error-container',    iconText: 'text-error',    special: false },
  { label: 'Instansi Tujuan', value: '15 Mitra',   sub: 'Tidak ada mitra baru',  subBg: 'bg-surface-container', subText: 'text-secondary',           Icon: Banknote,  iconBg: 'bg-primary-fixed',      iconText: 'text-primary',  special: false },
  { label: 'Belum Disetor',   value: 'Rp 30Jt',    sub: '65% dari total',        subBg: '',                     subText: '',                         Icon: Wallet,    iconBg: 'bg-white/20',           iconText: 'text-white',    special: true  },
  { label: 'Guru Diproses',   value: '84 / 84',    sub: '100% semua sinkron',    subBg: 'bg-tertiary-fixed',    subText: 'text-on-tertiary-fixed',   Icon: UserCheck, iconBg: 'bg-secondary-fixed',    iconText: 'text-on-secondary-fixed', special: false },
];

const chartData = [
  { m: 'OKT', h1: '60%', h2: '40%' }, { m: 'NOV', h1: '65%', h2: '35%' },
  { m: 'DES', h1: '50%', h2: '30%' }, { m: 'JAN', h1: '70%', h2: '50%' },
  { m: 'FEB', h1: '55%', h2: '45%' }, { m: 'MAR', h1: '80%', h2: '60%' },
  { m: 'APR', h1: '85%', h2: '65%', current: true },
];

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setDashboardData(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const displayStats = (dashboardData?.stats as any[]) || stats;
  const penyaluran = (dashboardData?.penyaluran as any) || { belumSetor: 3, totalInstansi: 15, bulanLabel: 'April 2026' };
  return (
    <AppShell>
      <div className="space-y-6 md:space-y-8">

        {/* Tombol Riwayat Bulan Lalu */}
        <section className="flex justify-end">
          <Link
            href="/riwayat-admin"
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 text-primary font-bold text-sm rounded-xl hover:bg-primary-fixed/30 transition-all active:scale-95 shadow-sm"
          >
            <CalendarDays className="w-4 h-4" />
            Lihat Bulan Sebelumnya
          </Link>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            <div className="col-span-2 md:col-span-4 flex justify-center py-10">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            displayStats.map((stat: any) => {
              const Icon = stat.Icon || IconMap[stat.icon] || Receipt;
              return (
                <div key={stat.label} className={`p-4 md:p-5 rounded-2xl shadow-sm ${stat.special ? 'salary-pulse-gradient' : 'bg-surface-container-lowest'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-9 h-9 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconText} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest text-right max-w-[80px] leading-tight ${stat.special ? 'text-white/70' : 'text-secondary'}`}>{stat.label}</span>
                  </div>
                  <p className={`text-xl md:text-2xl font-black ${stat.special ? 'text-white' : 'text-on-surface'}`}>{stat.value}</p>
                  {stat.sub && (
                    <div className="mt-2">
                      {stat.subBg ? (
                        <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${stat.subBg} ${stat.subText}`}>{stat.sub}</span>
                      ) : (
                        <p className="text-[9px] text-white/70">{stat.sub}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-surface-container-lowest p-5 md:p-8 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-on-surface">Tren Potongan Bulanan</h3>
                  <p className="text-xs text-secondary">Tahun Ajaran 2025/2026</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Koperasi
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase ml-2">
                    <span className="w-2 h-2 rounded-full bg-error"></span> Lainnya
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between h-36 md:h-48 gap-1 md:gap-3">
                {chartData.map((d) => (
                  <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex gap-0.5 h-full items-end">
                      <div className={`flex-1 rounded-t-sm ${d.current ? 'bg-primary' : 'bg-outline-variant/30'}`} style={{ height: d.h1 }} />
                      <div className={`flex-1 rounded-t-sm ${d.current ? 'bg-error' : 'bg-error/30'}`} style={{ height: d.h2 }} />
                    </div>
                    <span className={`text-[9px] md:text-[10px] font-bold ${d.current ? 'text-primary' : 'text-secondary'}`}>{d.m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Status Penyaluran Bulan Ini</h4>
              <p className="text-xl font-black text-on-surface">{penyaluran.belumSetor} dari {penyaluran.totalInstansi} Instansi</p>
              <p className="text-xs text-secondary mt-1">Belum menerima setoran bulan {penyaluran.bulanLabel}</p>
            </div>
          </section>

          {/* Activities */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-on-surface mb-5">Aktivitas Terkini</h3>
            <div className="space-y-5">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full ${a.bg} ${a.text} flex items-center justify-center shrink-0 mt-0.5`}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface leading-snug">{a.title}</p>
                    <p className="text-[10px] text-secondary mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
