import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Presentation, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Home = () => {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'student') navigate('/student');
    if (role === 'teacher') navigate('/teacher');
  }, [role, navigate]);

  const handleSelectRole = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-6 shadow-sm">
          <Sparkles className="h-4 w-4" />
          No Authentication Required
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Next-Gen Assessment Platform
        </h1>
        <p className="text-xl text-gray-600">
          Experience our AI-powered quiz engine with built-in anti-cheating mechanisms and deep performance analytics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => handleSelectRole('student')}
          className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <GraduationCap className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue as Student</h2>
            <p className="text-gray-600">Take quizzes, experience the anti-cheat environment, and view your AI-generated performance analytics.</p>
          </div>
        </button>

        <button
          onClick={() => handleSelectRole('teacher')}
          className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Presentation className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <Presentation className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue as Teacher</h2>
            <p className="text-gray-600">Create custom assessments, manage question banks, and explore the quiz builder interface.</p>
          </div>
        </button>
      </div>
    </div>
  );
};
