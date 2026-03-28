export type Role = 'student' | 'teacher' | null;

export type QuestionType = 'mcq' | 'tf' | 'short';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  points: number;
}

export interface CheatingLog {
  timestamp: number;
  type: 'tab_switch' | 'copy_paste' | 'right_click';
  details: string;
}

export interface Attempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  cheatingLogs: CheatingLog[];
  completedAt: number;
}