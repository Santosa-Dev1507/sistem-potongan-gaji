'use client';

import { useEffect, useState, FormEvent } from 'react';
import AppShell from '@/components/AppShell';
import { Guru } from '@/lib/types';
import { Search, Plus, Eye, X, Loader, MessageCircle, Send } from 'lucide-react';

// Mock fallback
const MOCK_GURU: Guru[] = [
  { nip: '198204152009031004', nama: 'Agus Mardani, S.Pd.',   jabatan: 'Guru IPA',        email: 'agus@smpn5klaten.sch.id',  no_wa: '6281234567890', aktif: true },
  { nip: '197509121998022001', nama: 'Siti Rahayu, M.Pd.',    jabatan: 'Guru Matematika', email: 'siti@smpn5klaten.sch.id',  no_wa: '6281234567891', aktif: true },
  { nip: '199002282015042003', nama: 'Budi Prasetyo, S.Kom.', jabatan: 'Guru TI',         email: 'budi@smpn5klaten.sch.id',  no_wa: '',              aktif: true },
  { nip: '198811052012121002', nama: 'Dewi Indah, S.S.',      jabatan: 'Guru Bahasa',     email: 'dewi@smpn5klaten.sch.id',  no_wa: '6281234567892', aktif: true },
  { nip: '123456789',          nama: 'Sri Juwariyah, M.Pd.',  jabatan: 'Guru PKN',        email: 'sri@smpn5klaten.sch.id',   no_wa: '6281234567893', aktif: true },
];

const BULAN_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

const INITIALS = (nama: string) => nama.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const COLORS = ['bg-secondary-container text-on-secondary-container', 'bg-tertiary-fixed text-on-tertiary-fixed', 'bg-primary-fixed text-primary', 'bg-secondary-fixed text-on-secondary-fixed'];

function buildWaLink(guru: Guru, bulan: string, tahun: number): string {
  const pesan = `Assalamu'alaikum, ${guru.nama}.\n\nBerikut kami sampaikan informasi potongan gaji Anda bulan *${bulan} ${tahun}* dari Bendahara SMPN 5 Klaten.\n\nSilakan cek rincian potongan Anda melalui Sistem Informasi Potongan (SIP) di:\n🔗 https://sistem-potongan-gaji.vercel.app\n\nLogin menggunakan:\nUsername: NIP Bapak/Ibu\nPassword: guru123\n\nTerima kasih. 🙏`;
  return `https://wa.me/${guru.no_wa}?text=${encodeURIComponent(pesan)}`;
}

export default function GuruPage() {
  const [guru, setGuru] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nip: '', nama: '', jabatan: '', email: '', no_wa: '' });
  const [blasting, setBlasting] = useState(false);
  const [blastInfo, setBlastInfo] = useState('');

  const now = new Date();
  const bulan = BULAN_ID[now.getMonth()];
  const tahun = now.getFullYear();

  useEffect(() => {
    fetch('/api/guru')
      .then((r) => r.json())
      .then((json) => setGuru(json.success && json.data?.length ? json.data : MOCK_GURU))
      .catch(() => setGuru(MOCK_GURU))
      .finally(() => setLoading(false));
  }, []);

  const filtered = guru.filter(
    (g) => g.nama.toLowerCase().includes(query.toLowerCase()) || g.nip.includes(query)
  );

  const guruDenganWA = guru.filter((g) => g.no_wa && g.aktif);

  // Blast WA ke semua guru — buka satu per satu dengan delay
  const handleBlastSemua = () => {
    const targets = filtered.filter((g) => g.no_wa);
    if (targets.length === 0) {
      alert('Tidak ada guru dengan nomor WA yang terdaftar.');
      return;
    }
    const konfirmasi = confirm(
      `Kirim pengingat WA ke ${targets.length} guru?\n\nBrowser akan membuka ${targets.length} tab WhatsApp secara berurutan. Pastikan popup diizinkan di browser Anda.`
    );
    if (!konfirmasi) return;

    setBlasting(true);
    targets.forEach((g, i) => {
      setTimeout(() => {
        window.open(buildWaLink(g, bulan, tahun), '_blank');
        if (i === targets.length - 1) {
          setBlasting(false);
          setBlastInfo(`✅ ${targets.length} pesan WA berhasil dibuka.`);
          setTimeout(() => setBlastInfo(''), 5000);
        }
      }, i * 800); // delay 800ms antar tab
    });
  };

  const handleTambah = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setGuru((prev) => [...prev, { ...form, aktif: true }]);
        setShowModal(false);
        setForm({ nip: '', nama: '', jabatan: '', email: '', no_wa: '' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Banner Blast */}
        {blastInfo && (
          <div className="flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">
            {blastInfo}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
            />
          </div>

          {/* Tombol Kirim Pengingat ke Semua */}
          <button
            onClick={handleBlastSemua}
            disabled={blasting || loading}
            title={`Kirim pengingat WA ke semua guru yang punya nomor (${guruDenganWA.length} guru)`}
            className="flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm rounded-xl shadow-md min-h-[44px] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {blasting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {blasting ? 'Mengirim...' : `Blast WA (${guruDenganWA.length})`}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 salary-pulse-gradient text-white font-bold text-sm rounded-xl shadow-md min-h-[44px] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Guru
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-surface-container-low">
                <tr>
                  {['NIP', 'Nama Guru', 'Jabatan', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-widest text-secondary font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-secondary text-sm">Memuat data...</td></tr>
                )}
                {!loading && filtered.map((g, i) => (
                  <tr key={g.nip} className="hover:bg-primary-fixed/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-secondary">{g.nip}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${COLORS[i % COLORS.length]}`}>
                          {INITIALS(g.nama)}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{g.nama}</p>
                          <p className="text-xs text-secondary">{g.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{g.jabatan || '–'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Tombol Lihat Slip */}
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-secondary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-all min-h-[36px]">
                          <Eye className="w-4 h-4" />
                          Slip
                        </button>

                        {/* Tombol Kirim WA */}
                        {g.no_wa ? (
                          <a
                            href={buildWaLink(g, bulan, tahun)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Kirim WA ke ${g.nama} (${g.no_wa})`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white rounded-lg text-xs font-semibold transition-all min-h-[36px]"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WA
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container/50 text-secondary/40 rounded-lg text-xs min-h-[36px] cursor-default" title="Nomor WA belum terdaftar">
                            <MessageCircle className="w-4 h-4" />
                            –
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-secondary text-sm">Tidak ada hasil untuk &quot;{query}&quot;</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-xs text-secondary">Menampilkan {filtered.length} dari {guru.length} guru</p>
            <p className="text-xs text-secondary">{guruDenganWA.length} guru terdaftar nomor WA</p>
          </div>
        </div>
      </div>

      {/* Modal Tambah Guru */}
      {showModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface">Tambah Guru Baru</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTambah} className="space-y-4">
              {[
                { field: 'nip',     label: 'NIP',           type: 'text',  required: true,  placeholder: '198204152009031004' },
                { field: 'nama',    label: 'Nama Lengkap',  type: 'text',  required: true,  placeholder: 'Nama + Gelar' },
                { field: 'jabatan', label: 'Jabatan',       type: 'text',  required: false, placeholder: 'Guru Matematika' },
                { field: 'email',   label: 'Email',         type: 'email', required: false, placeholder: 'nama@sekolah.sch.id' },
                { field: 'no_wa',   label: 'No. WhatsApp',  type: 'text',  required: false, placeholder: '628123456789 (tanpa + atau 0)' },
              ].map(({ field, label, type, required, placeholder }) => (
                <div key={field}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</label>
                  <input
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold text-secondary hover:bg-surface-container transition-all">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 salary-pulse-gradient text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
