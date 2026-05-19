import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
// ---------- Password hashing (SHA-256 via Web Crypto API) ----------
//
// In a real app, password hashing MUST happen on the server with a slow
// algorithm (bcrypt/argon2) and a per-user salt. This frontend-only prototype
// uses SHA-256 just to demonstrate the concept — passwords are never stored
// in plain text in localStorage.
//
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).
  map((b) => b.toString(16).padStart(2, '0')).
  join('');
}
// ---------- Demo seed credentials ----------
const DEMO_USERS_SEED: {
  user: User;
  password: string;
}[] = [
{
  user: mockUsers[0],
  password: 'tago2024'
},
{
  user: mockUsers[1],
  password: 'juan2024'
}];

const USERS_KEY = 'straypaw:users';
const SESSION_KEY = 'straypaw:session';
interface AuthContextType {
  user: User | null;
  users: User[];
  isReady: boolean;
  login: (
  username: string,
  password: string)
  => Promise<
    {
      ok: true;
    } |
    {
      ok: false;
      error: string;
    }>;

  logout: () => void;
  register: (
  username: string,
  email: string,
  password: string)
  => Promise<
    {
      ok: true;
    } |
    {
      ok: false;
      error: string;
    }>;

  changeUserRole: (
  userId: string,
  role: 'resident' | 'admin')
  => {
    ok: boolean;
    error?: string;
  };
  toggleUserSuspension: (userId: string) => {
    ok: boolean;
    error?: string;
  };
  deleteUser: (userId: string) => {
    ok: boolean;
    error?: string;
  };
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function loadUsers(): User[] | null {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User[];
  } catch {
    return null;
  }
}
function saveUsers(users: User[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {

    /* ignore */}
}
function loadSession(): User | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
function saveSession(user: User | null) {
  try {
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {

    /* ignore */}
}
export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isReady, setIsReady] = useState(false);
  // Seed demo users on first run + restore session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let existing = loadUsers();
      if (!existing || existing.length === 0) {
        const seeded: User[] = await Promise.all(
          DEMO_USERS_SEED.map(async ({ user: u, password }) => ({
            ...u,
            status: 'active' as const,
            password_hash: await hashPassword(password)
          }))
        );
        existing = seeded;
        saveUsers(seeded);
      } else {
        // Migrate existing users to have a status
        let migrated = false;
        existing = existing.map((u) => {
          if (!u.status) {
            migrated = true;
            return {
              ...u,
              status: 'active' as const
            };
          }
          return u;
        });
        if (migrated) saveUsers(existing);
      }
      if (cancelled) return;
      setUsers(existing);
      const session = loadSession();
      // Re-sync session against latest users list (in case user updated)
      if (session) {
        const fresh = existing.find((u) => u.id === session.id);
        setUser(fresh ?? null);
      }
      setIsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const login = async (username: string, password: string) => {
    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!found) {
      return {
        ok: false as const,
        error: 'No account found with that username.'
      };
    }
    if (!found.password_hash) {
      return {
        ok: false as const,
        error: 'This account has no password set. Please register again.'
      };
    }
    const hashed = await hashPassword(password);
    if (hashed !== found.password_hash) {
      return {
        ok: false as const,
        error: 'Incorrect password.'
      };
    }
    if (found.status === 'suspended') {
      return {
        ok: false as const,
        error: 'Your account has been suspended. Contact an administrator.'
      };
    }
    setUser(found);
    saveSession(found);
    return {
      ok: true as const
    };
  };
  const logout = () => {
    setUser(null);
    saveSession(null);
  };
  const register = async (
  username: string,
  email: string,
  password: string) =>
  {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedUsername.length < 3) {
      return {
        ok: false as const,
        error: 'Username must be at least 3 characters.'
      };
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      return {
        ok: false as const,
        error: 'Please enter a valid email address.'
      };
    }
    if (password.length < 6) {
      return {
        ok: false as const,
        error: 'Password must be at least 6 characters.'
      };
    }
    if (
    users.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    ))
    {
      return {
        ok: false as const,
        error: 'That username is already taken.'
      };
    }
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return {
        ok: false as const,
        error: 'An account with that email already exists.'
      };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      username: trimmedUsername,
      email: trimmedEmail,
      role: 'resident',
      status: 'active',
      created_at: new Date().toISOString(),
      password_hash: await hashPassword(password)
    };
    const next = [...users, newUser];
    setUsers(next);
    saveUsers(next);
    setUser(newUser);
    saveSession(newUser);
    return {
      ok: true as const
    };
  };
  const changeUserRole = (userId: string, role: 'resident' | 'admin') => {
    if (userId === user?.id)
    return {
      ok: false,
      error: 'Cannot change your own role.'
    };
    if (role === 'resident') {
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (adminCount <= 1)
      return {
        ok: false,
        error: 'Cannot demote the last admin.'
      };
    }
    const next = users.map((u) =>
    u.id === userId ?
    {
      ...u,
      role
    } :
    u
    );
    setUsers(next);
    saveUsers(next);
    return {
      ok: true
    };
  };
  const toggleUserSuspension = (userId: string) => {
    if (userId === user?.id)
    return {
      ok: false,
      error: 'Cannot suspend yourself.'
    };
    const next = users.map((u) =>
    u.id === userId ?
    {
      ...u,
      status:
      u.status === 'suspended' ? 'active' : 'suspended' as const
    } :
    u
    );
    setUsers(next);
    saveUsers(next);
    return {
      ok: true
    };
  };
  const deleteUser = (userId: string) => {
    if (userId === user?.id)
    return {
      ok: false,
      error: 'Cannot delete yourself.'
    };
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser?.role === 'admin') {
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (adminCount <= 1)
      return {
        ok: false,
        error: 'Cannot delete the last admin.'
      };
    }
    const next = users.filter((u) => u.id !== userId);
    setUsers(next);
    saveUsers(next);
    return {
      ok: true
    };
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isReady,
        login,
        logout,
        register,
        changeUserRole,
        toggleUserSuspension,
        deleteUser
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};