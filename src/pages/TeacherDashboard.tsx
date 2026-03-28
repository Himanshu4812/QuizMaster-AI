import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, FileText, Trash2, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const TeacherDashboard = () => {
  const { quizzes, deleteQuiz, attempts } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your quizzes and monitor student performance.</p>
        </div>
        <button
          onClick={() => navigate('/teacher/create')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="h-5 w-5" />
          Create New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const quizAttempts = attempts.filter(a => a.quizId === quiz.id);
          
          return (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{quiz.title}</h3>
                <button 
                  onClick={() => deleteQuiz(quiz.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete Quiz"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">{quiz.description}</p>
              
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>{quiz.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>{quiz.timeLimit} Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>{quizAttempts.length} Attempts</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {quizzes.length === 0 && (
          <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No quizzes yet</h3>
            <p className="text-gray-500">Get started by creating your first assessment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
