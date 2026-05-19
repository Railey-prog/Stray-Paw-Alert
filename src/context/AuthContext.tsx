import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { api, setToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  isReady: boolean;
  login: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  changeUserRole: (userId: string, role: 'resident' | 'admin') => Promise<{ ok: boolean; error?: string }>;
  toggleUserSuspension: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  deleteUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    api.get<User>('/auth/me')
      .then((u) => setUser(u))
      .catch(() => { setToken(null); })
      .finally(() => setIsReady(true));
  }, []);

  const refreshUsers = async () => {
    try {
      const list = await api.get<User[]>('/users');
      setUsers(list);
    } catch { /* ignore for non-admins */ }
  };

  useEffect(() => {
    if (user?.role === 'admin') refreshUsers();
  }, [user?.role]);

  const login = async (username: string, password: string) => {
    try {
      const { user: u, token } = await api.post<{ user: User; token: string }>('/auth/login', { username, password });
      setToken(token);
      setUser(u);
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUsers([]);
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { user: u, token } = await api.post<{ user: User; token: string }>('/auth/register', { username, email, password });
      setToken(token);
      setUser(u);
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || 'Registration failed' };
    }
  };

  const changeUserRole = async (userId: string, role: 'resident' | 'admin') => {
    try {
      const updated = await api.patch<User>(`/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  };

  const toggleUserSuspension = async (userId: string) => {
    try {
      const updated = await api.patch<User>(`/users/${userId}/suspension`, {});
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, isReady, login, logout, register, changeUserRole, toggleUserSuspension, deleteUser, refreshUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
