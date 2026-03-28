import { QuestionType } from './common';

export interface QuizRequest {
  topic: string;
  count: number;
  types: QuestionType[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestionPayload {
  type: 'mcq' | 'tf' | 'short';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
}

export interface QuizResponse {
  questions: QuizQuestionPayload[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: import('./common').Question[];
  createdAt: number;
  authorId: string;
}
