'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        router.replace('/');
      } else {
        setError('NIP / Kata sandi tidak valid. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-tertiary-fixed blur-3xl opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl border border-white/40">
        <div className="text-center mb-10">
          <img src="https://iili.io/FntumI2.md.png" alt="Logo SMPN 5 Klaten" className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-2xl font-black text-primary">SMPN 5 Klaten</h1>
          <p className="text-[10px] text-secondary mt-2 tracking-[0.2em] uppercase font-bold">
            Sistem Informasi Potongan
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-secondary uppercase px-1">
              ID Admin / NIP Guru
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Masukkan ID atau NIP Anda"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm min-h-[50px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-secondary uppercase px-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm min-h-[50px]"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-login"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-3 py-4 salary-pulse-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed min-h-[52px]"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Ke Sistem'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-[10px] text-secondary mt-8 font-medium leading-relaxed">
          Untuk keperluan internal SMPN 5 Klaten.<br />
          Akses tanpa izin adalah pelanggaran.
        </p>
      </div>
    </div>
  );
}
