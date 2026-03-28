import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const StudentDashboard = () => {
  const { quizzes, attempts, userId } = useAppContext();
  const navigate = useNavigate();

  const userAttempts = attempts.filter(a => a.studentId === userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Select a quiz to test your knowledge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const hasAttempted = userAttempts.find(a => a.quizId === quiz.id);

          return (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{quiz.title}</h3>
                  {hasAttempted && <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">{quiz.description}</p>
                
                <div className="flex flex-col gap-3 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span>{quiz.timeLimit} Minutes</span>
                  </div>
                </div>
              </div>

              {hasAttempted ? (
                <button
                  onClick={() => navigate(`/results/${hasAttempted.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View Results
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                  <Play className="h-4 w-4" /> Start Quiz
                </button>
              )}
            </div>
          );
        })}

        {quizzes.length === 0 && (
          <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No quizzes available</h3>
            <p className="text-gray-500">Check back later when teachers add new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};
