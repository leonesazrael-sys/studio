"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { Candidate, User, SystemSettings } from './types';
import { INITIAL_CANDIDATES } from './initial-data';

interface AppContextType {
  candidates: Candidate[];
  addCandidate: (c: Omit<Candidate, 'id'>) => void;
  updateCandidate: (c: Candidate) => void;
  deleteCandidate: (id: string) => void;
  user: User | null;
  updateUserProfile: (nome: string, email: string) => void;
  updateUserPassword: (current: string, newPass: string) => { success: boolean; message: string };
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  settings: SystemSettings;
  updateSettings: (s: SystemSettings) => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  nomeSistema: 'RANKING GCM',
  permitirCadastro: true,
  colunasVisiveis: ['posicao', 'inscricao', 'nome', 'nota', 'vaga', 'tipo'],
  paginacaoPadrao: 10
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedCandidates = localStorage.getItem('gcm_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      setCandidates(INITIAL_CANDIDATES);
    }

    const savedUser = localStorage.getItem('gcm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedSettings = localStorage.getItem('gcm_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const persistCandidates = (newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('gcm_candidates', JSON.stringify(newCandidates));
  };

  const addCandidate = (c: Omit<Candidate, 'id'>) => {
    if (!settings.permitirCadastro && user?.role !== 'ADMIN') return;
    const newCandidate = { ...c, id: Math.random().toString(36).substr(2, 9) };
    persistCandidates([...candidates, newCandidate]);
  };

  const updateCandidate = (updated: Candidate) => {
    persistCandidates(candidates.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCandidate = (id: string) => {
    persistCandidates(candidates.filter(c => c.id !== id));
  };

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gcm_settings', JSON.stringify(newSettings));
  };

  const updateUserProfile = (nome: string, email: string) => {
    if (!user) return;
    const updatedUser = { ...user, nome, email };
    setUser(updatedUser);
    localStorage.setItem('gcm_user', JSON.stringify(updatedUser));
  };

  const updateUserPassword = (current: string, newPass: string) => {
    if (!user) return { success: false, message: "Usuário não logado" };
    // Simulação de validação (em um app real seria via hash no backend)
    // Para o demo, usamos senhas fixas definidas no login
    const currentStoredPass = user.email === 'admin@example.com' ? 'admin' : 'user';
    
    if (current !== currentStoredPass) {
      return { success: false, message: "Senha atual incorreta." };
    }
    
    // Sucesso na simulação
    return { success: true, message: "Senha alterada com sucesso!" };
  };

  const login = (email: string, pass: string) => {
    let loggedUser: User | null = null;
    if (email === 'admin@example.com' && pass === 'admin') {
      loggedUser = { id: 'admin-1', nome: 'Administrador', email, role: 'ADMIN' };
    } else if (email === 'user@example.com' && pass === 'user') {
      loggedUser = { id: 'user-1', nome: 'Usuário Comum', email, role: 'USER' };
    }

    if (loggedUser) {
      setUser(loggedUser);
      localStorage.setItem('gcm_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gcm_user');
  };

  return (
    <AppContext.Provider value={{ 
      candidates, 
      addCandidate, 
      updateCandidate, 
      deleteCandidate, 
      user, 
      updateUserProfile,
      updateUserPassword,
      login, 
      logout,
      settings,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
