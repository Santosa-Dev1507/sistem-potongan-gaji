import React from 'react';
import { LayoutDashboard, Users, Upload, History, FileText, Landmark, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guru', label: 'Data Guru', icon: Users },
    { id: 'import', label: 'Impor Tagihan', icon: Upload },
    { id: 'distribusi', label: 'Distribusi Saluran', icon: Landmark },
  ];

  const guruNavItems = [
    { id: 'rincian', label: 'Rincian Potongan', icon: FileText },
    { id: 'riwayat', label: 'Potongan Bulan Lalu', icon: History },
  ];

  const navItems = user?.role === 'guru' ? guruNavItems : adminNavItems;

  const handleNavClick = () => {
    // Close drawer on mobile after navigation
    onClose();
  };

  return (
    <aside
      className={`
        h-screen w-72 md:w-64 fixed left-0 top-0 bg-slate-50 border-r border-slate-200 flex flex-col p-4 gap-2
        transition-transform duration-300 ease-in-out
        z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* Header with close button (mobile only) */}
      <div className="flex items-center justify-between px-2 py-4 mb-2">
        <div className="flex items-center gap-3">
          <img src="https://iili.io/FntumI2.md.png" alt="Logo SMPN 5 Klaten" className="w-12 h-12 object-contain shrink-0 drop-shadow-sm" />
          <div>
            <h1 className="text-base font-bold text-[#000666] leading-none">SMPN 5 Klaten</h1>
            <p className="text-[10px] text-secondary tracking-widest uppercase mt-1">Sistem Potongan</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg text-secondary hover:bg-slate-200 transition-colors"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const path = item.id === 'dashboard' ? '/' : `/${item.id}`;
          const isActive = location.pathname === path;
          return (
            <Link
              key={item.id}
              to={path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 w-full text-left ${
                isActive 
                  ? 'bg-primary/10 text-primary font-bold ring-1 ring-primary/20' 
                  : 'text-[#4c616c] hover:bg-slate-200/70 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile & logout */}
      <div className="mt-auto p-4 bg-surface-container rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden text-left flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-on-surface">
              {user?.role === 'admin' ? 'Administrator' : `NIP: ${user?.username}`}
            </p>
            <p className="text-[9px] text-secondary truncate">{user?.email}</p>
          </div>
          <button 
            onClick={logout} 
            className="p-2 text-error hover:bg-error-container rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
