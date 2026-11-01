import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock initial users (demo credentials)
const INITIAL_USERS = [
  {
    id: 'landlord-1',
    name: 'Emeka Johnson',
    email: 'emeka@demo.com',
    password: 'demo123',
    role: 'landlord',
    avatar: 'EJ',
    kycStatus: 'verified',
    kycSubmittedAt: '2026-09-10',
    joinedAt: '2026-08-01',
    phone: '+234 803 012 3456',
    bankName: 'Guaranty Trust Bank',
    bankAccount: '**** **** 4821',
  },
  {
    id: 'tenant-1',
    name: 'Tunde Adeyemi',
    email: 'tunde@demo.com',
    password: 'demo123',
    role: 'tenant',
    avatar: 'TA',
    joinedAt: '2026-09-15',
    phone: '+234 708 987 6543',
    savedProperties: ['prop-1', 'prop-3'],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ts-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState(INITIAL_USERS);

  const login = (email, password, role) => {
    const found = users.find(
      u => u.email === email && u.password === password && u.role === role
    );
    if (found) {
      setUser(found);
      localStorage.setItem('ts-user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials or role mismatch.' };
  };

  const register = (data) => {
    const exists = users.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'Email already registered.' };

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      avatar: data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      kycStatus: data.role === 'landlord' ? 'not_started' : undefined,
      joinedAt: new Date().toISOString().split('T')[0],
      savedProperties: data.role === 'tenant' ? [] : undefined,
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('ts-user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ts-user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('ts-user', JSON.stringify(updated));
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const submitKyc = (kycData) => {
    // Simulate async KYC submission → pending
    updateUser({ kycStatus: 'pending', kycSubmittedAt: new Date().toISOString().split('T')[0], kycData });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, submitKyc, users }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
