"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { Candidate, User } from './types';
import { INITIAL_CANDIDATES } from './initial-data';

interface AppContextType {
  candidates: Candidate[];
  addCandidate: (c: Omit<Candidate, 'id'>) => void;
  updateCandidate: (c: Candidate) => void;
  deleteCandidate: (id: string) => void;
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedCandidates = localStorage.getItem('rankinsight_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      setCandidates(INITIAL_CANDIDATES);
    }

    const savedUser = localStorage.getItem('rankinsight_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const persistCandidates = (newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('rankinsight_candidates', JSON.stringify(newCandidates));
  };

  const addCandidate = (c: Omit<Candidate, 'id'>) => {
    const newCandidate = { ...c, id: Math.random().toString(36).substr(2, 9) };
    persistCandidates([...candidates, newCandidate]);
  };

  const updateCandidate = (updated: Candidate) => {
    persistCandidates(candidates.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCandidate = (id: string) => {
    persistCandidates(candidates.filter(c => c.id !== id));
  };

  const login = (email: string, pass: string) => {
    // Demo logic: admin@example.com / admin, user@example.com / user
    let loggedUser: User | null = null;
    if (email === 'admin@example.com' && pass === 'admin') {
      loggedUser = { id: 'admin-1', nome: 'Administrador', email, role: 'ADMIN' };
    } else if (email === 'user@example.com' && pass === 'user') {
      loggedUser = { id: 'user-1', nome: 'Usuário Comum', email, role: 'USER' };
    }

    if (loggedUser) {
      setUser(loggedUser);
      localStorage.setItem('rankinsight_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rankinsight_user');
  };

  return (
    <AppContext.Provider value={{ candidates, addCandidate, updateCandidate, deleteCandidate, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
