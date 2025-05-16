import { QuizQuestion } from "@/lib/types/quiz";

export function selectNextQuestion(
  questions: QuizQuestion[],
  answeredQuestions: string[],
  correctAnswers: number,
  totalAnswered: number
): QuizQuestion | null {
  const unansweredQuestions = questions.filter(
    (q) => !answeredQuestions.includes(q.id)
  );

  if (unansweredQuestions.length === 0) return null;

  // Calculate accuracy to determine difficulty
  const accuracy = totalAnswered > 0 ? correctAnswers / totalAnswered : 0;

  let difficulty: string;
  if (accuracy > 0.75) {
    difficulty = "hard";
  } else if (accuracy > 0.5) {
    difficulty = "medium";
  } else {
    difficulty = "easy";
  }

  // Prefer questions of the target difficulty, fall back if none available
  let nextQuestions = unansweredQuestions.filter(
    (q) => q.difficulty === difficulty
  );
  if (nextQuestions.length === 0) {
    nextQuestions = unansweredQuestions;
  }

  // Select a random question from the filtered pool
  const randomIndex = Math.floor(Math.random() * nextQuestions.length);
  return nextQuestions[randomIndex] || null;
}