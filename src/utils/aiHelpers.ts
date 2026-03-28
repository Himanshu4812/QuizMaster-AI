import { QuizResponse, QuizQuestionPayload } from '../types/quiz';

export const parseAIResponse = (content: string): QuizQuestionPayload[] => {
  const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
  let parsed: QuizResponse;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error('Failed to parse AI response JSON.');
  }

  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    throw new Error('AI response format invalid: missing questions array.');
  }

  return parsed.questions;
};

export const formatAIError = (error: unknown): string => {
  if (!error) return 'Unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Unexpected error format from AI service.';
};

export const difficultyLabel = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return 'Unknown';
  }
};
