'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { LayoutDashboard, Users, Upload, Landmark, FileText, History, LogOut, X, Menu, Calendar, Bell, CalendarDays } from 'lucide-react';
import Link from 'next/link';

const adminNav = [
  { href: '/dashboard',     label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/guru',          label: 'Data Guru',           icon: Users },
  { href: '/import',        label: 'Impor Tagihan',       icon: Upload },
  { href: '/distribusi',    label: 'Distribusi Saluran',  icon: Landmark },
  { href: '/riwayat-admin', label: 'Riwayat Historis',   icon: CalendarDays },
];

const guruNav = [
  { href: '/rincian', label: 'Rincian Potongan',    icon: FileText },
  { href: '/riwayat', label: 'Potongan Bulan Lalu', icon: History },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':     { title: 'Dashboard Potongan',    subtitle: 'Overview Rekapitulasi' },
  '/guru':          { title: 'Direktori Guru',         subtitle: 'Potongan Individu' },
  '/import':        { title: 'Impor Tagihan Guru',     subtitle: 'Buku Kas Institusi' },
  '/distribusi':    { title: 'Distribusi Penyaluran',  subtitle: 'Instansi Pihak Ke-3' },
  '/rincian':       { title: 'Rincian Potongan',       subtitle: 'SMPN 5 Klaten' },
  '/riwayat':       { title: 'Riwayat Potongan',       subtitle: 'Rekam Jejak Operasional' },
  '/riwayat-admin': { title: 'Riwayat Historis',       subtitle: 'Data Bulan Sebelumnya' },
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const nav = user.role === 'guru' ? guruNav : adminNav;
  const page = pageTitles[pathname] ?? { title: 'SIP', subtitle: 'SMPN 5 Klaten' };

  const now = new Date();
  const bulanTahun = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed left-0 top-0 h-screen w-72 md:w-64 z-50
        bg-slate-50 border-r border-slate-200
        flex flex-col p-4 gap-2
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Logo & close */}
        <div className="flex items-center justify-between px-2 py-4 mb-2">
          <div className="flex items-center gap-3">
            <img src="https://iili.io/FntumI2.md.png" alt="Logo" className="w-12 h-12 object-contain shrink-0 drop-shadow-sm" />
            <div>
              <h1 className="text-base font-bold text-primary leading-none">SMPN 5 Klaten</h1>
              <p className="text-[10px] text-secondary tracking-widest uppercase mt-1">Sistem Potongan</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden p-2 rounded-lg text-secondary hover:bg-slate-200 transition-colors" aria-label="Tutup menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm ${
                  active ? 'bg-primary/10 text-primary font-bold ring-1 ring-primary/20' : 'text-secondary hover:bg-slate-200/70 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : ''}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout */}
        <div className="mt-auto p-4 bg-surface-container rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-on-surface">
                {user.role === 'admin' ? 'Administrator' : `NIP: ${user.username}`}
              </p>
              <p className="text-[9px] text-secondary truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); router.replace('/login'); }}
              className="p-2 text-error hover:bg-error-container rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-header border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-8 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg text-secondary hover:bg-surface-container-high transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary leading-none">{page.subtitle}</p>
              <h2 className="text-base md:text-xl font-black text-primary leading-snug line-clamp-1">{page.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-[11px] font-bold text-primary tracking-tight uppercase">{bulanTahun}</span>
            </div>
            <button className="relative p-2 text-secondary min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
