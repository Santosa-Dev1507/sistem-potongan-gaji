import React from 'react';
import { Eye } from 'lucide-react';

export interface TeacherData {
  nip: string;
  name: string;
  dept: string;
  totalTagihan?: string;
  jumlahPotongan?: number;
  init: string;
  bg: string;
  text: string;
}

interface TeacherTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  teacher: TeacherData;
}

export const TeacherTableRow: React.FC<TeacherTableRowProps> = ({ teacher, ...props }) => {
  return (
    <tr className="group hover:bg-primary-fixed/20 transition-colors" {...props}>
      <td className="px-5 md:px-8 py-5">
        <span className="font-mono text-xs text-on-surface-variant">{teacher.nip}</span>
      </td>
      <td className="px-5 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${teacher.bg} ${teacher.text} flex items-center justify-center font-bold text-xs shrink-0`}>
            {teacher.init}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary text-sm leading-snug truncate">{teacher.name}</p>
            <p className="text-xs text-secondary">{teacher.dept}</p>
          </div>
        </div>
      </td>
      <td className="px-5 md:px-8 py-5">
        <span className="text-sm text-error font-black">{teacher.totalTagihan || '–'}</span>
      </td>
      <td className="px-5 md:px-8 py-5">
        <span className="px-3 py-1 bg-primary-fixed text-primary text-xs font-bold rounded-full">
          {teacher.jumlahPotongan ?? 0} item
        </span>
      </td>
      <td className="px-5 md:px-8 py-5 text-right">
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-secondary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-all min-h-[36px]"
          aria-label={`Lihat slip ${teacher.name}`}
        >
          <Eye className="w-4 h-4" />
          Lihat Slip
        </button>
      </td>
    </tr>
  );
};
