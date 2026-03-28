import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Sparkles, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Question, QuestionType } from '../types/common';
import { Quiz } from '../types/quiz';
import { generateId } from '../utils/helpers';
import { generateQuizQuestions } from '../services/aiService';

export const QuizBuilder = () => {
  const navigate = useNavigate();
  const { addQuiz, userId } = useAppContext();

  // Quiz Details State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState<Question[]>([]);

  // AI Generator State
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiTypes, setAiTypes] = useState<QuestionType[]>(['mcq', 'tf']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      type,
      text: '',
      options: type === 'mcq' ? ['', '', '', ''] : type === 'tf' ? ['True', 'False'] : undefined,
      correctAnswer: '',
      points: type === 'short' ? 15 : 10,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic.');
      return;
    }
    if (aiTypes.length === 0) {
      setAiError('Please select at least one question type.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const generatedQuestions = await generateQuizQuestions({
        topic: aiTopic,
        count: aiCount,
        types: aiTypes,
        difficulty: aiDifficulty,
      });
      
      setQuestions(prev => [...prev, ...generatedQuestions]);
      setAiTopic(''); // Clear topic on success
    } catch (error: any) {
      setAiError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = () => {
    if (!title.trim() || questions.length === 0) {
      alert('Please provide a title and at least one question.');
      return;
    }

    const quiz: Quiz = {
      id: generateId(),
      title,
      description,
      timeLimit,
      questions,
      createdAt: Date.now(),
      authorId: userId,
    };

    addQuiz(quiz);
    navigate('/teacher');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/teacher')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quiz Details & AI Generator */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quiz Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Advanced React Patterns"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the quiz..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* AI Generator Card (No API Key Input!) */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-indigo-900">AI Assistant</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">Topic</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., Arrays in Java"
                  className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-2">Question Types</label>
                <div className="flex flex-wrap gap-2">
                  {(['mcq', 'tf', 'short'] as QuestionType[]).map(type => (
                    <label key={type} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-indigo-200 cursor-pointer hover:bg-indigo-50">
                      <input
                        type="checkbox"
                        checked={aiTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) setAiTypes([...aiTypes, type]);
                          else setAiTypes(aiTypes.filter(t => t !== type));
                        }}
                        className="text-indigo-600 focus:ring-indigo-500 rounded"
                      />
                      <span className="text-sm text-indigo-900">
                        {type === 'mcq' ? 'Multiple Choice' : type === 'tf' ? 'True/False' : 'Short Answer'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{aiError}</p>
                </div>
              )}

              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isGenerating ? 'Generating...' : 'Generate Questions'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Questions ({questions.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => handleAddQuestion('mcq')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors">+ MCQ</button>
              <button onClick={() => handleAddQuestion('tf')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors">+ T/F</button>
              <button onClick={() => handleAddQuestion('short')} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors">+ Short</button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <p className="text-gray-500">No questions added yet. Use the AI Assistant or add manually.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group">
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase">
                      {q.type}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">Question {index + 1}</span>
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                    placeholder="Enter question text..."
                    className="w-full text-lg font-medium px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 outline-none mb-4 bg-transparent"
                  />

                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-3 mt-4">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === opt && opt !== ''}
                            onChange={() => handleUpdateQuestion(q.id, { correctAnswer: opt })}
                            className="h-4 w-4 text-indigo-600"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(q.options || [])];
                              newOptions[i] = e.target.value;
                              // If this was the correct answer, update it too
                              const updates: Partial<Question> = { options: newOptions };
                              if (q.correctAnswer === opt) updates.correctAnswer = e.target.value;
                              handleUpdateQuestion(q.id, updates);
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'tf' && (
                    <div className="flex gap-4 mt-4">
                      {['True', 'False'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === opt}
                            onChange={() => handleUpdateQuestion(q.id, { correctAnswer: opt })}
                            className="h-4 w-4 text-indigo-600"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'short' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => handleUpdateQuestion(q.id, { correctAnswer: e.target.value })}
                        placeholder="Expected correct answer..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={handleSaveQuiz}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors font-bold text-lg shadow-md"
            >
              <Save className="h-6 w-6" /> Save & Publish Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
