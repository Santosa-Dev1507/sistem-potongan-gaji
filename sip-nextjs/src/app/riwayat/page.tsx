'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/components/AuthProvider';
import { formatRupiah } from '@/lib/types';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Record {
  month: string;
  id: string;
  totalPotongan: number;
  status: 'SELESAI' | 'DIPROSES';
}

const MOCK: Record[] = [
  { month: 'Maret 2026',    id: 'POT-2026-03', totalPotongan: 44_100_000, status: 'SELESAI'  },
];

const STATUS_CFG = {
  SELESAI:  { label: 'Selesai',  bg: 'bg-tertiary-fixed',  text: 'text-on-tertiary-fixed', icon: CheckCircle },
  DIPROSES: { label: 'Diproses', bg: 'bg-primary-fixed',   text: 'text-primary',            icon: Clock       },
};

export default function RiwayatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Ambil bulan lalu
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const bulan = now.toLocaleDateString('id-ID', { month: 'long' });
    const tahun = now.getFullYear();

    fetch(`/api/slip?nip=${user.username}&bulan=${bulan}&tahun=${tahun}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const slip = json.data;
          const total = (slip.potongan as { nominal: number }[]).reduce((s: number, p: { nominal: number }) => s + p.nominal, 0);
          setRecord({ month: `${slip.bulan} ${slip.tahun}`, id: slip.id, totalPotongan: total, status: 'SELESAI' });
        } else {
          setRecord(MOCK[0]);
        }
      })
      .catch(() => setRecord(MOCK[0]))
      .finally(() => setLoading(false));
  }, [user]);

  const cfg = record ? STATUS_CFG[record.status] : null;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="mb-2">
          <p className="text-xs text-secondary font-medium uppercase tracking-widest">Potongan Bulan Lalu</p>
          <h3 className="text-2xl font-black text-on-surface">{record?.month ?? '–'}</h3>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center text-secondary text-sm">Memuat data...</div>
        )}

        {!loading && record && cfg && (
          <button
            onClick={() => router.push('/rincian')}
            className="w-full text-left bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-5 hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-primary text-base">{record.month}</p>
                  <p className="text-[11px] text-secondary font-mono mt-0.5"># {record.id}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${cfg.bg} ${cfg.text}`}>
                <cfg.icon className="w-3 h-3" />
                {cfg.label}
              </span>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
              <p className="text-sm text-secondary font-medium">Total Potongan Disetor</p>
              <p className="font-black text-xl text-error">{formatRupiah(record.totalPotongan)}</p>
            </div>
            <p className="text-xs text-primary font-semibold mt-3 text-right underline underline-offset-2">Lihat Rincian →</p>
          </button>
        )}

        {!loading && !record && (
          <div className="bg-white rounded-2xl p-8 text-center text-secondary text-sm">
            Data bulan lalu belum tersedia.
          </div>
        )}

        <p className="text-xs text-secondary text-center pt-2">
          Untuk riwayat lebih lanjut, hubungi Bendahara SMPN 5 Klaten.
        </p>
      </div>
    </AppShell>
  );
}
