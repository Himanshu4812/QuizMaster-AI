import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Attempt } from '../types/common';
import { Quiz } from '../types/quiz';
import { initialQuizzes } from '../data/mockData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  userId: string;
  quizzes: Quiz[];
  attempts: Attempt[];
  addQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  addAttempt: (attempt: Attempt) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => (localStorage.getItem('app_role') as Role) || null);
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('app_user_id') || '');
  
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('app_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    const saved = localStorage.getItem('app_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('app_attempts', JSON.stringify(attempts));
  }, [attempts]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('app_role', newRole || '');
    if (!userId && newRole) {
      const newId = `demo-${newRole}-${Math.floor(Math.random() * 10000)}`;
      setUserId(newId);
      localStorage.setItem('app_user_id', newId);
    }
  };

  const logout = () => {
    setRole(null);
    setUserId('');
    localStorage.removeItem('app_role');
    localStorage.removeItem('app_user_id');
  };

  const addQuiz = (quiz: Quiz) => setQuizzes([...quizzes, quiz]);
  const deleteQuiz = (id: string) => setQuizzes(quizzes.filter(q => q.id !== id));
  const addAttempt = (attempt: Attempt) => setAttempts([...attempts, attempt]);

  return (
    <AppContext.Provider value={{ role, setRole, userId, quizzes, attempts, addQuiz, deleteQuiz, addAttempt, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
