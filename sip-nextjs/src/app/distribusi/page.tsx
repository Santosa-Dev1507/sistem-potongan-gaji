'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { DistribusiItem, formatRupiah } from '@/lib/types';
import { Printer, Building2, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

const BULAN_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

export default function DistribusiPage() {
  const now = new Date();
  const [bulan] = useState(BULAN_ID[now.getMonth()]);
  const [tahun] = useState(now.getFullYear());
  const [data, setData] = useState<DistribusiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/distribusi?bulan=${bulan}&tahun=${tahun}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Gagal memuat data');
      }
    } catch {
      setError('Koneksi gagal');
    } finally {
      setLoading(false);
    }
  }, [bulan, tahun]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (item: DistribusiItem) => {
    const newStatus = item.status === 'SUDAH_DISETOR' ? 'BELUM_DISETOR' : 'SUDAH_DISETOR';
    setToggling(item.instansi);

    // Optimistic update
    setData((prev) =>
      prev.map((d) =>
        d.instansi === item.instansi
          ? { ...d, status: newStatus, tglSetor: newStatus === 'SUDAH_DISETOR' ? new Date().toISOString().split('T')[0] : undefined }
          : d
      )
    );

    try {
      await fetch('/api/distribusi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulan, tahun, instansi: item.instansi, status: newStatus }),
      });
    } catch {
      fetchData(); // rollback kalau gagal
    } finally {
      setToggling(null);
    }
  };

  // Summary calculations
  const aktif = data.filter((d) => d.totalDana > 0);
  const totalTerkumpul = aktif.reduce((s, d) => s + d.totalDana, 0);
  const totalDisetor   = aktif.filter((d) => d.status === 'SUDAH_DISETOR').reduce((s, d) => s + d.totalDana, 0);
  const totalBelum     = totalTerkumpul - totalDisetor;
  const jumlahBelum    = aktif.filter((d) => d.status === 'BELUM_DISETOR').length;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* Toolbar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-on-surface">Distribusi Tagihan Potongan</h2>
            <p className="text-secondary text-sm mt-1">
              Rekapitulasi dana yang harus disetorkan ke instansi pihak ke-3 — {bulan} {tahun}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-on-surface font-bold text-sm rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-all min-h-[44px] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => window.print()}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl min-h-[44px] active:scale-95 transition-all disabled:opacity-40 print:hidden"
            >
              <Printer className="w-4 h-4" />
              Cetak Rekap
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[
            { label: 'Total Dana Terkumpul', value: loading ? '…' : formatRupiah(totalTerkumpul), cls: 'bg-surface-container' },
            { label: 'Telah Disetorkan',      value: loading ? '…' : formatRupiah(totalDisetor),   cls: 'bg-surface-container' },
            { label: 'Belum Disetor',          value: loading ? '…' : formatRupiah(totalBelum),     cls: 'bg-error-container' },
            { label: 'Instansi Belum Setor',   value: loading ? '…' : `${jumlahBelum} Instansi`,   cls: 'bg-surface-container' },
          ].map(({ label, value, cls }) => (
            <div key={label} className={`${cls} p-4 md:p-5 rounded-2xl`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 leading-tight">{label}</p>
              <h3 className="text-xl md:text-2xl font-black text-on-surface">{value}</h3>
            </div>
          ))}
        </section>

        {/* Error */}
        {error && (
          <div className="bg-error/10 text-error text-sm font-medium px-5 py-4 rounded-2xl">
            ⚠️ {error}
          </div>
        )}

        {/* Table */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
          <div className="p-4 md:p-6 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 className="font-bold text-on-surface">Rincian Mitra Penyaluran</h3>
            <span className="text-xs text-secondary">{aktif.length} instansi aktif</span>
          </div>

          {loading ? (
            <div className="divide-y divide-outline-variant/10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-surface-container shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-container rounded w-40" />
                    <div className="h-2.5 bg-surface-container rounded w-28" />
                  </div>
                  <div className="h-6 bg-surface-container rounded w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    {['Instansi / Pihak Ke-3', 'Kategori', 'Jml Guru', 'Total Dana', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {data.filter((d) => d.totalDana > 0).map((item) => {
                    const sudah = item.status === 'SUDAH_DISETOR';
                    const busy  = toggling === item.instansi;
                    return (
                      <tr key={item.instansi} className="hover:bg-primary-fixed/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <p className="font-bold text-primary text-sm">{item.instansi}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface-variant">{item.kategori}</td>
                        <td className="px-5 py-4 text-sm font-bold">{item.jumlahGuru} Guru</td>
                        <td className="px-5 py-4 font-black text-primary">{formatRupiah(item.totalDana)}</td>
                        <td className="px-5 py-4">
                          <div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sudah ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error/10 text-error'}`}>
                              {sudah ? 'Sudah Disetor' : 'Belum Disetor'}
                            </span>
                            {sudah && item.tglSetor && (
                              <p className="text-[10px] text-secondary mt-1 pl-1">{item.tglSetor}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggle(item)}
                            disabled={busy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 min-h-[36px] disabled:opacity-50 ${
                              sudah
                                ? 'bg-surface-container text-secondary hover:bg-error/10 hover:text-error'
                                : 'bg-tertiary-fixed/30 text-on-tertiary-fixed hover:bg-tertiary-fixed/60'
                            }`}
                          >
                            {busy ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : sudah ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {sudah ? 'Batalkan' : 'Tandai Disetor'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Instansi belum setor alert */}
        {!loading && jumlahBelum > 0 && (
          <section className="bg-primary-container p-5 rounded-2xl flex items-start gap-4 flex-col sm:flex-row print:hidden">
            <Clock className="w-6 h-6 text-on-primary-container shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-on-primary-container">
                {jumlahBelum} Instansi Belum Menerima Setoran
              </h4>
              <p className="text-sm text-on-primary-container/80 mt-1">
                {data.filter((d) => d.totalDana > 0 && d.status === 'BELUM_DISETOR').map((d) => d.instansi).join(', ')}
              </p>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
