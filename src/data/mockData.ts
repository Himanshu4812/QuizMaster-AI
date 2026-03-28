import { Quiz } from '../types/quiz';

export const initialQuizzes: Quiz[] = [
  {
    id: 'demo-quiz-1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React hooks, state, and components.',
    timeLimit: 5,
    createdAt: Date.now(),
    authorId: 'demo-teacher',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'Which hook is used to manage state in a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        points: 10,
      },
      {
        id: 'q2',
        type: 'tf',
        text: 'React components must always return a single root DOM node.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 5,
      },
      {
        id: 'q3',
        type: 'short',
        text: 'What does JSX stand for?',
        correctAnswer: 'JavaScript XML',
        points: 15,
      }
    ]
  }
];
