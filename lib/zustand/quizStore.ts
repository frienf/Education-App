import { create } from "zustand";
import { QuizQuestion } from "@/lib/types/quiz";
import { selectNextQuestion } from "@/lib/utils/adaptiveQuizLogic";

type QuizState = {
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  answeredQuestions: string[];
  score: number;
  correctAnswers: number;
  fetchQuestions: () => Promise<void>;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
};

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestion: null,
  answeredQuestions: [],
  score: 0,
  correctAnswers: 0,
  fetchQuestions: async () => {
    try {
      const response = await fetch("/api/quiz");
      const data = await response.json();
      set({
        questions: data,
        currentQuestion: data.find((q: QuizQuestion) => q.difficulty === "easy") || data[0] || null,
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  },
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
    set((state) => ({
      currentQuestion: state.questions.find((q) => q.difficulty === "easy") || state.questions[0] || null,
      answeredQuestions: [],
      score: 0,
      correctAnswers: 0,
    })),
}));