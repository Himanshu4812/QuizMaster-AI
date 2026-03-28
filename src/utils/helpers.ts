export const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const getAIRecommendation = (percentage: number, cheatingLogs: number): string => {
  if (cheatingLogs > 2) return "⚠️ High number of focus losses detected. Ensure you are taking the quiz in a distraction-free environment.";
  if (percentage >= 90) return "🌟 Outstanding performance! You have a strong grasp of these concepts. Consider exploring advanced topics.";
  if (percentage >= 70) return "📈 Good job! Review the questions you missed to solidify your understanding.";
  if (percentage >= 50) return "📚 You're getting there. Focus on reviewing the core materials before attempting similar quizzes.";
  return "💡 It looks like you struggled with this topic. We recommend revisiting the foundational concepts and trying again.";
};
