'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { Receipt, Banknote, Wallet, UserCheck, Upload, CheckCircle, Edit2, AlertTriangle, History, Loader, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { ElementType } from 'react';
const IconMap: Record<string, ElementType> = { Receipt, Banknote, Wallet, UserCheck };

const stats = [
  { label: 'Total Potongan',  value: 'Rp 45.6Jt', sub: '+2.4% dari bulan lalu', subBg: 'bg-error-container',    subText: 'text-on-error-container', Icon: Receipt,   iconBg: 'bg-error-container',    iconText: 'text-error',    special: false },
  { label: 'Instansi Tujuan', value: '15 Mitra',   sub: 'Tidak ada mitra baru',  subBg: 'bg-surface-container', subText: 'text-secondary',           Icon: Banknote,  iconBg: 'bg-primary-fixed',      iconText: 'text-primary',  special: false },
  { label: 'Belum Disetor',   value: 'Rp 30Jt',    sub: '65% dari total',        subBg: '',                     subText: '',                         Icon: Wallet,    iconBg: 'bg-white/20',           iconText: 'text-white',    special: true  },
  { label: 'Guru Diproses',   value: '84 / 84',    sub: '100% semua sinkron',    subBg: 'bg-tertiary-fixed',    subText: 'text-on-tertiary-fixed',   Icon: UserCheck, iconBg: 'bg-secondary-fixed',    iconText: 'text-on-secondary-fixed', special: false },
];



export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const BULAN_ID = [
      'Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'
    ];
    const bulan = BULAN_ID[now.getMonth()];
    const tahun = now.getFullYear();
    fetch(`/api/dashboard?bulan=${bulan}&tahun=${tahun}`)
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
  const fallbackBulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][new Date().getMonth()];
  const penyaluran = (dashboardData?.penyaluran as any) || { belumSetor: 3, totalInstansi: 15, bulanLabel: `${fallbackBulan} ${new Date().getFullYear()}` };
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Status Penyaluran</h4>
              <p className="text-2xl font-black text-on-surface">{penyaluran.belumSetor} <span className="text-base text-secondary font-medium">/ {penyaluran.totalInstansi} Instansi</span></p>
              <p className="text-xs text-secondary mt-1">Belum menerima setoran bulan {penyaluran.bulanLabel}</p>
            </div>
            <Link href="/distribusi" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold text-sm rounded-xl hover:bg-primary-fixed/30 transition-all">
              Detail Penyaluran →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
