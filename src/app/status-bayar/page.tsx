'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { StatusBayarItem, formatRupiah } from '@/lib/types';
import { Wallet, CheckCircle2, Clock, RefreshCw, Search, CheckSquare } from 'lucide-react';

const BULAN_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

export default function StatusBayarPage() {
  const now = new Date();
  const [bulan] = useState(BULAN_ID[now.getMonth()]);
  const [tahun] = useState(now.getFullYear());
  const [data, setData] = useState<StatusBayarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'SEMUA' | 'LUNAS' | 'BELUM'>('SEMUA');
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/pembayaran?bulan=${bulan}&tahun=${tahun}`);
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

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  const handleToggle = async (item: StatusBayarItem) => {
    const newStatus = item.status === 'LUNAS' ? 'BELUM' : 'LUNAS';
    setToggling(item.nip);

    // Optimistic update
    setData((prev) =>
      prev.map((d) =>
        d.nip === item.nip
          ? { ...d, status: newStatus, tglBayar: newStatus === 'LUNAS' ? new Date().toISOString().split('T')[0] : undefined }
          : d
      )
    );

    try {
      const res = await fetch('/api/pembayaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulan, tahun, nip: item.nip, status: newStatus }),
      });
      
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal menyimpan status');
      }
    } catch (err: any) {
      alert(err.message || 'Koneksi gagal');
      fetchData(); // rollback
    } finally {
      setToggling(null);
    }
  };

  const handleBulkLunas = async () => {
    if (!confirm('Tandai semua guru yang belum bayar menjadi LUNAS?')) return;
    
    setBulkLoading(true);
    const nipsToUpdate = data.filter(d => d.status === 'BELUM').map(d => d.nip);
    
    // Optimistic
    setData(prev => prev.map(d => 
      d.status === 'BELUM' ? { ...d, status: 'LUNAS', tglBayar: new Date().toISOString().split('T')[0] } : d
    ));

    try {
      const res = await fetch('/api/pembayaran/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulan, tahun, nips: nipsToUpdate }),
      });
      
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal update massal');
      }
    } catch (err: any) {
      alert(err.message || 'Koneksi gagal');
      fetchData(); // rollback
    } finally {
      setBulkLoading(false);
    }
  };

  // Summary
  const totalGuru = data.length;
  const totalLunas = data.filter(d => d.status === 'LUNAS').length;
  const totalBelum = data.filter(d => d.status === 'BELUM').length;
  const totalTerkumpul = data.filter(d => d.status === 'LUNAS').reduce((s, d) => s + d.totalPotongan, 0);

  // Filtered data
  const filteredData = data.filter(d => {
    if (filter !== 'SEMUA' && d.status !== filter) return false;
    if (search && !d.nama.toLowerCase().includes(search.toLowerCase()) && !d.nip.includes(search)) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* Toolbar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-on-surface">Status Pembayaran Guru</h2>
            <p className="text-secondary text-sm mt-1">
              Catatan pembayaran potongan dari guru ke bendahara — {bulan} {tahun}
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
              onClick={handleBulkLunas}
              disabled={loading || bulkLoading || totalBelum === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl min-h-[44px] active:scale-95 transition-all disabled:opacity-40"
            >
              <CheckSquare className="w-4 h-4" />
              Tandai Semua Lunas
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[
            { label: 'Total Guru', value: loading ? '…' : totalGuru, cls: 'bg-surface-container' },
            { label: 'Sudah Lunas', value: loading ? '…' : totalLunas, cls: 'bg-tertiary-container' },
            { label: 'Belum Bayar', value: loading ? '…' : totalBelum, cls: 'bg-error-container' },
            { label: 'Dana Terkumpul', value: loading ? '…' : formatRupiah(totalTerkumpul), cls: 'bg-surface-container' },
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

        {/* Table & Filters */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
          <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input 
                type="text" 
                placeholder="Cari nama / NIP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex bg-surface-container-low rounded-xl p-1 border border-outline-variant/20 w-full sm:w-auto">
              {(['SEMUA', 'LUNAS', 'BELUM'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
                >
                  {f === 'SEMUA' ? 'Semua' : f === 'LUNAS' ? 'Lunas' : 'Belum'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-secondary">Memuat data...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-secondary">Tidak ada guru yang sesuai filter/pencarian.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    {['No', 'Pegawai', 'Total Potongan', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredData.map((item, idx) => {
                    const lunas = item.status === 'LUNAS';
                    const busy  = toggling === item.nip;
                    return (
                      <tr key={item.nip} className="hover:bg-primary-fixed/20 transition-colors">
                        <td className="px-5 py-4 text-sm text-secondary font-mono">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-on-surface text-sm">{item.nama}</p>
                          <p className="text-xs text-secondary font-mono mt-0.5">{item.nip}</p>
                        </td>
                        <td className="px-5 py-4 font-black text-on-surface">{formatRupiah(item.totalPotongan)}</td>
                        <td className="px-5 py-4">
                          <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lunas ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error/10 text-error'}`}>
                              {lunas ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {lunas ? 'Lunas' : 'Belum Bayar'}
                            </span>
                            {lunas && item.tglBayar && (
                              <p className="text-[10px] text-secondary mt-1 pl-1">{item.tglBayar}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggle(item)}
                            disabled={busy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 min-h-[36px] disabled:opacity-50 ${
                              lunas
                                ? 'bg-surface-container text-secondary hover:bg-error/10 hover:text-error'
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            {busy ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : lunas ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <Wallet className="w-3.5 h-3.5" />
                            )}
                            {lunas ? 'Batalkan' : 'Tandai Lunas'}
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
      </div>
    </AppShell>
  );
}
