import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trendValue: string;
  trendText: string;
  iconBgClass: string;
  iconTextClass: string;
  trendBgClass: string;
  trendTextClass: string;
  isSpecial?: boolean;
  specialProgress?: number;
}

export function DashboardStatCard({
  title, value, icon: Icon, trendValue, trendText,
  iconBgClass, iconTextClass, trendBgClass, trendTextClass,
  isSpecial, specialProgress
}: DashboardStatCardProps) {
  if (isSpecial) {
    return (
      <div className="salary-pulse-gradient col-span-1 md:col-span-1 p-4 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${iconBgClass} flex items-center justify-center ${iconTextClass}`}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-white/70 tracking-widest uppercase text-right max-w-[80px] leading-tight">{title}</span>
        </div>
        <p className="text-xl md:text-2xl font-black text-white relative z-10">{value}</p>
        <div className="mt-3 relative z-10">
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-tertiary-fixed-dim rounded-full shadow-[0_0_8px_rgba(136,217,130,0.6)]" style={{ width: `${specialProgress || 0}%` }}></div>
          </div>
          <p className="text-[9px] text-white/70 mt-1.5">{specialProgress}% dari BPD Bank Jateng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${iconBgClass} flex items-center justify-center ${iconTextClass}`}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-[9px] md:text-[10px] font-bold text-secondary tracking-widest uppercase text-right max-w-[80px] leading-tight">{title}</span>
      </div>
      <p className="text-xl md:text-2xl font-black text-on-surface">{value}</p>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${trendBgClass} ${trendTextClass}`}>
          {trendValue}
        </span>
        <span className="text-[10px] text-secondary leading-snug">{trendText}</span>
      </div>
    </div>
  );
}
