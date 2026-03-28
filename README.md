# QuizMaster AI

## Tagline

An intelligent AI-powered quiz platform for teachers and students with anti-cheating and performance analytics.

---

## Project Overview

**QuizMaster AI** is an AI-focused educational application designed to make quiz delivery and assessment intelligent, efficient, and secure. The platform empowers teachers to rapidly build quizzes, automated by AI, while providing students with a modern test-taking experience complete with real-time anti-cheating safeguards and actionable analytics.

Key capabilities:

- AI-based quiz generation: questions are generated through the OpenRouter API, based on instructor prompts and learning objectives.
- Teacher dashboard: create, edit, and manage quiz content; monitor assignment status and performance.
- Student dashboard: attempt quizzes, navigate personalized workflows, and view immediate results.
- Anti-cheating features: detects tab switching, copy/paste attempts, and right-click events during assessments.
- Results and analytics: performance reporting, score breakdowns, and trends for continuous improvement.

---

## Highlights

- 🚀 AI-powered dynamic quiz generation
- 🛡️ Built-in anti-cheating detection
- 📊 Student and teacher analytics dashboard
- 📱 Fully responsive modern UI
- ⚡ Built with React + TypeScript + Vite

## Features

- AI-generated quizzes using OpenRouter API
- Multiple question types:
  - MCQ
  - True/False
  - Short Answer
- Teacher quiz builder
- Student quiz attempt system
- Anti-cheating detection:
  - Tab switching
  - Copy-paste
  - Right-click tracking
- Result analysis
- Responsive UI
- Role-based interfaces (teacher, student)

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenRouter API
- Context API
- Custom hooks

---

## Folder Structure

```
src/
  App.tsx
  index.css
  main.tsx
  components/
    Navbar.tsx
  context/
    AppContext.tsx
  data/
    mockData.ts
  hooks/
    useAntiCheat.ts
  pages/
    Home.tsx
    QuizAttempt.tsx
    QuizBuilder.tsx
    Results.tsx
    StudentDashboard.tsx
    TeacherDashboard.tsx
  services/
    aiService.ts
  types/
    common.ts
    quiz.ts
  utils/
    aiHelpers.ts
    helpers.ts
```

---

## Installation

```bash
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root and add:

```env
OPENROUTER_API_KEY=your_api_key_here
```

---

## Workflow

1. Teacher logs in and creates a quiz using the builder.
2. AI generates quiz questions and secures the test in the teacher dashboard.
3. Student pulls the test from their interface and starts the attempt.
4. Anti-cheat monitor runs, watching for tab switches, copy/paste, and right-click actions.
5. After completion, results are captured and analytics are generated for both student and teacher.

---

## Screenshots

> Add UI screenshots here (e.g. teacher dashboard, quiz builder, attempt mode, results page).

---

## Future Enhancements

- Backend integration (Node/Express)
- Authentication and user roles with secure login
- Database support for users, quizzes, and history
- Leaderboard and gamification
- Downloadable reports and certificates
- Deeper analytics (time-on-question, accuracy heatmaps, skill tracking)

---

## Author

**Himanshu Kumar**

- GitHub: https://github.com/Himanshu4812
- LinkedIn: https://www.linkedin.com/in/himanshu4812/



