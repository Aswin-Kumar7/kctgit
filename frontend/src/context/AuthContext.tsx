import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe } from '../services/api';

export interface AuthUser { id: string; username: string; email: string; name?: string; phone?: string }

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (data: { token: string; user: AuthUser }) => void;
  logout: () => void;
  loading: boolean;
  refreshUser?: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem('token') || (document.cookie.match(/(^|;)\s*token=([^;]+)/)?.[2] ?? null);
    if (storedToken) {
      setToken(storedToken);
      getMe()
        .then((res) => setUser(res))
        .catch(() => {
      // keep cookie but clear localStorage fallback
      localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const setAuth = ({ token, user }: { token: string; user: AuthUser }) => {
  // store token in cookie (allow multiple browser profiles) and localStorage fallback
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
  localStorage.removeItem('token');
  // clear cookie
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  setToken(null);
  setUser(null);
  };

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      // ignore
    }
  };

  return (
  <AuthContext.Provider value={{ user, token, setAuth, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
