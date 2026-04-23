import React from 'react';
import { Calendar, Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return { title: 'Dashboard Potongan', subtitle: 'Overview Rekapitulasi' };
      case '/guru': return { title: 'Direktori Guru', subtitle: 'Potongan Individu' };
      case '/import': return { title: 'Impor Tagihan Guru', subtitle: 'Buku Kas Institusi' };
      case '/riwayat': return { title: 'Riwayat Potongan', subtitle: 'Rekam Jejak Operasional' };
      case '/distribusi': return { title: 'Distribusi Penyaluran', subtitle: 'Instansi Pihak Ke-3' };
      case '/rincian': return { title: 'Rincian Potongan', subtitle: 'SMPN 5 Klaten' };
      default: return { title: 'Sistem Informasi Potongan', subtitle: 'SMPN 5 Klaten' };
    }
  };

  const { title, subtitle } = getTitle();
  // Get the current month/year dynamically
  const now = new Date();
  const bulanTahun = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <header className="sticky top-0 z-30 w-full glass-header flex justify-between items-center px-4 md:px-8 py-3 md:py-4 shadow-sm shadow-primary/5 border-b border-outline-variant/20">
      <div className="flex items-center gap-3">
        {/* Hamburger toggle — mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-secondary hover:bg-surface-container-high transition-colors -ml-1 min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary leading-none">
            {subtitle}
          </span>
          <h2 className="text-base md:text-xl font-black text-[#000666] leading-snug line-clamp-1">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
          <Calendar className="w-4 h-4 text-secondary" />
          <span className="text-[11px] font-bold text-primary tracking-tight uppercase">{bulanTahun}</span>
        </div>
        <button
          className="relative p-2 text-secondary hover:text-primary transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-surface-container-high"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
