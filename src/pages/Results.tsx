import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, Clock, Target, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatTime, getAIRecommendation } from '../utils/helpers';

export const Results = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { attempts, quizzes } = useAppContext();

  const attempt = attempts.find(a => a.id === attemptId);
  const quiz = quizzes.find(q => q.id === attempt?.quizId);

  if (!attempt || !quiz) {
    return <div className="p-8 text-center text-gray-500">Result not found.</div>;
  }

  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
  const aiRecommendation = getAIRecommendation(percentage, attempt.cheatingLogs.length);

  // Chart Data
  const chartData = [
    { name: 'Correct', value: attempt.score, color: '#4F46E5' }, // Indigo 600
    { name: 'Incorrect', value: attempt.maxScore - attempt.score, color: '#E5E7EB' } // Gray 200
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/student')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h1>
              <p className="text-gray-600">{quiz.title}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-indigo-600">{percentage}%</div>
              <div className="text-sm text-gray-500 mt-1">{attempt.score} / {attempt.maxScore} Points</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Accuracy</p>
                <p className="text-xl font-bold text-gray-900">{percentage}%</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Time Spent</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(attempt.timeSpent)}</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3 text-indigo-800 font-semibold">
              <Sparkles className="h-5 w-5" />
              AI Performance Analysis
            </div>
            <p className="text-indigo-900 leading-relaxed">{aiRecommendation}</p>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-600"></span> Correct</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Incorrect</div>
            </div>
          </div>

          {/* Integrity Report */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-gray-400" /> Integrity Report
            </h3>
            
            {attempt.cheatingLogs.length === 0 ? (
              <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm font-medium border border-green-100">
                ✓ No suspicious behaviour detected.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{attempt.cheatingLogs.length} violations recorded.</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                  {attempt.cheatingLogs.map((log, i) => (
                    <div key={i} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="font-mono text-gray-400 mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      {log.details}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
