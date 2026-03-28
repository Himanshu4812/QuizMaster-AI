import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { formatTime, generateId } from '../utils/helpers';
import { Attempt } from '../types/common';

export const QuizAttempt = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { quizzes, addAttempt, userId } = useAppContext();
  
  const quiz = quizzes.find(q => q.id === quizId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz ? quiz.timeLimit * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { logs, warning } = useAntiCheat(true);

  // Auto-submit when time is up
  useEffect(() => {
    if (!quiz || isSubmitting) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, quiz]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = useCallback(() => {
    if (!quiz) return { score: 0, maxScore: 0 };
    let score = 0;
    let maxScore = 0;

    quiz.questions.forEach(q => {
      maxScore += q.points;
      const userAnswer = answers[q.id] || '';
      
      if (q.type === 'short') {
        if (userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          score += q.points;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          score += q.points;
        }
      }
    });

    return { score, maxScore };
  }, [quiz, answers]);

  const handleSubmit = useCallback(() => {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);

    const { score, maxScore } = calculateScore();
    const timeSpent = (quiz.timeLimit * 60) - timeLeft;

    const attempt: Attempt = {
      id: generateId(),
      quizId: quiz.id,
      studentId: userId,
      answers,
      score,
      maxScore,
      timeSpent,
      cheatingLogs: logs,
      completedAt: Date.now()
    };

    addAttempt(attempt);
    navigate(`/results/${attempt.id}`, { replace: true });
  }, [quiz, isSubmitting, calculateScore, timeLeft, answers, logs, userId, addAttempt, navigate]);

  if (!quiz) {
    return <div className="p-8 text-center text-gray-500">Quiz not found.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Anti-Cheat Warning Toast */}
      {warning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium">
            <ShieldAlert className="h-5 w-5" />
            {warning}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header / Timer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex justify-between items-center sticky top-20 z-40">
          <div>
            <h1 className="font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6 min-h-[300px]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
              {currentQuestion.text}
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded ml-4 whitespace-nowrap">
              {currentQuestion.points} pts
            </span>
          </div>

          <div className="mt-8">
            {(currentQuestion.type === 'mcq' || currentQuestion.type === 'tf') && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestion.id] === opt
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={opt}
                      checked={answers[currentQuestion.id] === opt}
                      onChange={() => handleAnswer(currentQuestion.id, opt)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short' && (
              <div>
                <textarea
                  rows={4}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" /> Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-colors"
            >
              Next <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
