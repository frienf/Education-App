import { create } from "zustand";
import { QuizQuestion } from "@/lib/types/quiz";
import { selectNextQuestion } from "@/lib/utils/adaptiveQuizLogic";

type QuizState = {
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  answeredQuestions: string[];
  score: number;
  correctAnswers: number;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
};

// Sample question pool with difficulty levels (replace with API call in production)
const questionPool: QuizQuestion[] = [
  {
    id: "1",
    text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
    difficulty: "easy",
  },
  {
    id: "2",
    text: "Which planet is known as the Red Planet?",
    options: ["Mars", "Jupiter", "Venus", "Mercury"],
    correctAnswer: "Mars",
    difficulty: "easy",
  },
  {
    id: "3",
    text: "What is the derivative of x^2?",
    options: ["2x", "x^2", "2", "x"],
    correctAnswer: "2x",
    difficulty: "medium",
  },
  {
    id: "4",
    text: "What is the chemical symbol for Gold?",
    options: ["Au", "Ag", "Fe", "Cu"],
    correctAnswer: "Au",
    difficulty: "medium",
  },
  {
    id: "5",
    text: "Solve: ∫(0 to 1) x^2 dx",
    options: ["1/3", "1/2", "1", "2/3"],
    correctAnswer: "1/3",
    difficulty: "hard",
  },
  {
    id: "6",
    text: "What is the primary source of energy for Earth'sclimate system?",
    options: ["Sun", "Geothermal", "Nuclear", "Tides"],
    correctAnswer: "Sun",
    difficulty: "hard",
  },
];

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: questionPool,
  currentQuestion: questionPool.find((q) => q.difficulty === "easy") || null,
  answeredQuestions: [],
  score: 0,
  correctAnswers: 0,
  selectAnswer: (answer) =>
    set((state) => {
      if (!state.currentQuestion) return state;
      const isCorrect = answer === state.currentQuestion.correctAnswer;
      return {
        score: isCorrect ? state.score + 1 : state.score,
        correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        answeredQuestions: [...state.answeredQuestions, state.currentQuestion.id],
      };
    }),
  nextQuestion: () =>
    set((state) => {
      const nextQuestion = selectNextQuestion(
        state.questions,
        state.answeredQuestions,
        state.correctAnswers,
        state.answeredQuestions.length
      );
      return { currentQuestion: nextQuestion };
    }),
  resetQuiz: () =>
    set({
      currentQuestion: questionPool.find((q) => q.difficulty === "easy") || null,
      answeredQuestions: [],
      score: 0,
      correctAnswers: 0,
    }),
}));