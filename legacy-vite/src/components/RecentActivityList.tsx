import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ActivityItemProps {
  icon: LucideIcon;
  bg: string;
  text: string;
  title: string;
  time: string;
}

interface RecentActivityListProps {
  activities: ActivityItemProps[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-on-surface">Aktivitas Terkini</h3>
      </div>
      <div className="space-y-5 flex-1">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-3 group">
            <div className="mt-0.5 shrink-0">
              <div className={`w-8 h-8 rounded-full ${act.bg} ${act.text} flex items-center justify-center`}>
                <act.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface leading-snug">{act.title}</p>
              <p className="text-[10px] text-secondary mt-1">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
