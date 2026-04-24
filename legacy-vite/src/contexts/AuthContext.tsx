import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  role: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Gunakan useState untuk simpan user secara lokal di memori.
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // Simulasi Server Delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock Login Credential untuk Admin
    if (username === 'admin' && password === 'admin123') {
      setUser({
        username: 'Administrator',
        role: 'admin',
        email: 'admin@smpn5klaten.sch.id'
      });
      return true;
    }

    // Mock Login Credential untuk Guru (Deteksi NIP berangka)
    // Anggap pass standard semua guru adalah 'guru123'
    if (/^\d+$/.test(username) && password === 'guru123') {
      setUser({
        username: username, // NIP dipakai sbg display name sementara
        role: 'guru',
        email: 'guru@smpn5klaten.sch.id'
      });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
