import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export function LoginView() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      // Wait a slight moment for natural feel
      if (success) {
        navigate('/');
      } else {
        setError('Kredensial tidak valid. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary-fixed blur-3xl opacity-30 mix-blend-multiply"></div>

      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl border border-white/40">
        <div className="text-center mb-10">
          <img src="https://iili.io/FntumI2.md.png" alt="Logo SMPN 5 Klaten" className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-2xl font-black text-[#000666]">SMPN 5 Klaten</h1>
          <p className="text-xs text-secondary mt-2 tracking-[0.2em] uppercase font-bold">Gerbang Buku Kas Institusi</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-secondary uppercase px-1">ID Admin Utama / NIP Pegawai</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                placeholder="Masukkan ID Anda"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Kata Sandi</label>
              <a href="#" className="text-[10px] font-bold text-primary hover:underline">Lupa Sandi?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 flex items-center justify-center gap-3 py-4 salary-pulse-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? 'Memverifikasi...' : 'Masuk Ke Sistem'}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
        
        <p className="text-center text-[10px] text-secondary mt-8 font-medium">
          Dihidupi oleh Departemen Keuangan Daerah. <br/>Akses tanpa izin adalah tindak pelanggaran hukum.
        </p>
      </div>
    </div>
  );
}
