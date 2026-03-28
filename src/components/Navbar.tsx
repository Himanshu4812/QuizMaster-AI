import React from 'react';
import { BrainCircuit, LogOut, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { role, logout, userId } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600">
              <BrainCircuit className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">QuizMaster AI</span>
            </Link>
          </div>
          
          {role && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <User className="h-4 w-4" />
                <span className="capitalize">{role}</span>
                <span className="text-gray-400">|</span>
                <span className="font-mono text-xs">{userId}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Exit Role"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
