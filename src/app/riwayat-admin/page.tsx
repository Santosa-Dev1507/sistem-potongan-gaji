'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { formatRupiah } from '@/lib/types';
import {
  Receipt, Banknote, Wallet, UserCheck,
  ChevronLeft, ChevronRight, CalendarDays,
  TrendingDown, Building2, Loader, AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { ElementType } from 'react';

const IconMap: Record<string, ElementType> = { Receipt, Banknote, Wallet, UserCheck };

const BULAN_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

// Hasilkan 12 bulan terakhir (tidak termasuk bulan ini)
function generateBulanList(): { bulan: string; tahun: number; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      bulan: BULAN_ID[d.getMonth()],
      tahun: d.getFullYear(),
      label: `${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return result;
}

interface DashboardStat {
  label: string;
  value: string;
  sub: string;
  subBg: string;
  subText: string;
  icon: string;
  iconBg: string;
  iconText: string;
  special: boolean;
}

interface DashboardData {
  stats: DashboardStat[];
  penyaluran: { belumSetor: number; totalInstansi: number; bulanLabel: string };
}

export default function RiwayatAdminPage() {
  const bulanList = generateBulanList();
  const [selectedIdx, setSelectedIdx] = useState(0); // default = bulan lalu
  const selected = bulanList[selectedIdx];

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/dashboard?bulan=${selected.bulan}&tahun=${selected.tahun}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Gagal memuat data');
      }
    } catch {
      setError('Koneksi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [selected.bulan, selected.tahun]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const canPrev = selectedIdx < bulanList.length - 1;
  const canNext = selectedIdx > 0;

  return (
    <AppShell>
      <div className="space-y-6 md:space-y-8">

        {/* ── Header ── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary hover:bg-surface-container-high transition-colors shrink-0"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                Riwayat Potongan
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-primary leading-tight">
                Data Historis Admin
              </h2>
              <p className="text-sm text-secondary mt-0.5">SMP Negeri 5 Klaten</p>
            </div>
          </div>

          {/* Navigator Bulan */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-1.5">
            <button
              onClick={() => setSelectedIdx((i) => i + 1)}
              disabled={!canPrev || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 min-w-[160px] justify-center">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold text-sm text-primary">
                {selected.label}
              </span>
            </div>

            <button
              onClick={() => setSelectedIdx((i) => i - 1)}
              disabled={!canNext || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ── Timeline pills ── */}
        <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {bulanList.map((b, idx) => (
            <button
              key={b.label}
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                idx === selectedIdx
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              {b.bulan.slice(0, 3)} {b.tahun}
            </button>
          ))}
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="bg-error/10 text-error text-sm font-medium px-5 py-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Stats Cards ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 md:p-5 rounded-2xl bg-surface-container animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-surface-container-high mb-3" />
                  <div className="h-6 bg-surface-container-high rounded w-24 mb-2" />
                  <div className="h-3 bg-surface-container-high rounded w-16" />
                </div>
              ))
            : data?.stats.map((stat) => {
                const Icon = IconMap[stat.icon] || Receipt;
                return (
                  <div
                    key={stat.label}
                    className={`p-4 md:p-5 rounded-2xl shadow-sm ${stat.special ? 'salary-pulse-gradient' : 'bg-surface-container-lowest'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-9 h-9 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconText} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest text-right max-w-[80px] leading-tight ${stat.special ? 'text-white/70' : 'text-secondary'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <p className={`text-xl md:text-2xl font-black ${stat.special ? 'text-white' : 'text-on-surface'}`}>
                      {stat.value}
                    </p>
                    {stat.sub && (
                      <div className="mt-2">
                        {stat.subBg ? (
                          <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${stat.subBg} ${stat.subText}`}>
                            {stat.sub}
                          </span>
                        ) : (
                          <p className="text-[9px] text-white/70">{stat.sub}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

          {/* Loader center jika belum ada data */}
          {loading && (
            <div className="col-span-2 md:col-span-4 flex justify-center py-6">
              <Loader className="w-7 h-7 animate-spin text-primary" />
            </div>
          )}
        </section>

        {/* ── Penyaluran Summary ── */}
        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status setor */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 md:p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-widest mb-1">
                  Status Penyaluran
                </p>
                <p className="text-2xl font-black text-on-surface">
                  {data.penyaluran.belumSetor}
                  <span className="text-base font-bold text-secondary"> / {data.penyaluran.totalInstansi}</span>
                </p>
                <p className="text-sm text-secondary mt-0.5">
                  Instansi belum menerima setoran — {data.penyaluran.bulanLabel}
                </p>
              </div>
            </div>

            {/* CTA ke distribusi */}
            <div className="bg-primary-container rounded-2xl p-5 md:p-6 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-on-primary-container" />
                  <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
                    Rekap Distribusi
                  </p>
                </div>
                <p className="text-sm text-on-primary-container/80 leading-relaxed">
                  Lihat detail distribusi per instansi untuk bulan ini di halaman Distribusi Saluran.
                </p>
              </div>
              <Link
                href="/distribusi"
                className="shrink-0 px-4 py-2 bg-white text-primary font-bold text-sm rounded-xl hover:bg-primary-fixed transition-all active:scale-95"
              >
                Buka →
              </Link>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && !data && (
          <div className="bg-white rounded-2xl p-10 text-center text-secondary text-sm">
            Tidak ada data untuk {selected.label}.
          </div>
        )}

        {/* ── Catatan ── */}
        <p className="text-xs text-secondary text-center pt-2">
          Data diambil langsung dari Google Sheets. Untuk koreksi, hubungi Administrator sistem.
        </p>
      </div>
    </AppShell>
  );
}
