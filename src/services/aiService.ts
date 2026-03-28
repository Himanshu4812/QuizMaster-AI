import { QuizRequest, QuizQuestionPayload } from '../types/quiz';
import { Question, QuestionType } from '../types/common';
import { parseAIResponse, formatAIError } from '../utils/aiHelpers';
import { generateId } from '../utils/helpers';

const env = (import.meta as any).env || {};
const OPENROUTER_API_KEY = env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

export const generateQuizQuestions = async (payload: QuizRequest): Promise<Question[]> => {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_API_KEY') {
    throw new Error('Missing OpenRouter API key. Set VITE_OPENROUTER_API_KEY in your .env file.');
  }

  try {
    const prompt = `You are an expert educator. Generate a quiz based on these details:\n\nTopic: ${payload.topic}\nNumber of Questions: ${payload.count}\nQuestion Types: ${payload.types.join(', ')}\nDifficulty: ${payload.difficulty}\n\nRules:\n- Mix selected question types.\n- Ensure clear, accurate, topic-relevant questions.\n- For mcq: exactly 4 options.\n- For tf: exactly 2 options (True/False).\n- For short: no options.\n- Type must be 'mcq', 'tf', or 'short'.\nReturn strictly valid JSON with a questions array. No code blocks or markdown.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant that generates structured JSON quizzes.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as any).error?.message || `OpenRouter API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid AI response structure from OpenRouter.');
    }

    const quizPayload = parseAIResponse(content);

    return quizPayload.map((item: QuizQuestionPayload) => {
      let type: QuestionType = 'short';
      if (item.type === 'mcq') type = 'mcq';
      if (item.type === 'tf') type = 'tf';

      return {
        id: generateId(),
        type,
        text: item.question,
        options: item.options || (type === 'tf' ? ['True', 'False'] : undefined),
        correctAnswer: String(item.correctAnswer),
        points: type === 'short' ? 15 : type === 'mcq' ? 10 : 5,
      };
    });
  } catch (err) {
    const message = formatAIError(err);
    console.error('[aiService] generateQuizQuestions error:', message);
    throw new Error(message);
  }
};
