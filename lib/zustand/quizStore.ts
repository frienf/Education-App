import { create } from "zustand";
import { QuizQuestion } from "@/lib/types/quiz";
import { selectNextQuestion } from "@/lib/utils/adaptiveQuizLogic";

type QuizState = {
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  answeredQuestions: string[];
  score: number;
  correctAnswers: number;
  questionCounter: number;
  fetchQuestions: () => Promise<void>;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setCurrentQuestion: (question: QuizQuestion) => void;
};

const validateQuestion = (question: any): QuizQuestion | null => {
  if (!question) return null;
  
  // Ensure options is an array
  const options = Array.isArray(question.options) 
    ? question.options 
    : typeof question.options === 'string' 
      ? JSON.parse(question.options) 
      : [];

  return {
    id: question.id,
    text: question.text || '',
    options: options,
    correctAnswer: question.correctAnswer || '',
    difficulty: question.difficulty || 'medium',
  };
};

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestion: null,
  answeredQuestions: [],
  score: 0,
  correctAnswers: 0,
  questionCounter: 0,
  fetchQuestions: async () => {
    try {
      const response = await fetch("/api/quiz");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validate and transform the questions
      const validatedQuestions = data.map(validateQuestion).filter(Boolean);
      
      set({
        questions: validatedQuestions,
        currentQuestion: validatedQuestions[0] || null,
        score: 0,
        correctAnswers: 0,
        answeredQuestions: [],
        questionCounter: 0
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      throw error;
    }
  },
  selectAnswer: (answer) =>
    set((state) => {
      if (!state.currentQuestion) return state;
      
      const isCorrect = answer === state.currentQuestion.correctAnswer;
      const newScore = isCorrect ? state.score + 1 : state.score;
      const newCorrectAnswers = isCorrect ? state.correctAnswers + 1 : state.correctAnswers;
      
      // Update the questions array with the selected answer
      const updatedQuestions = state.questions.map(q => 
        q.id === state.currentQuestion?.id 
          ? { ...q, selectedAnswer: answer }
          : q
      );

      // Increment question counter, but don't exceed total questions
      const newQuestionCounter = Math.min(state.questionCounter + 1, state.questions.length);

      // Only get next question if we haven't reached the end
      const nextQuestion = newQuestionCounter < state.questions.length
        ? selectNextQuestion(
            updatedQuestions,
            [...state.answeredQuestions, state.currentQuestion.id],
            newCorrectAnswers,
            newQuestionCounter
          )
        : null;

      return {
        score: newScore,
        correctAnswers: newCorrectAnswers,
        answeredQuestions: [...state.answeredQuestions, state.currentQuestion.id],
        questions: updatedQuestions,
        currentQuestion: nextQuestion,
        questionCounter: newQuestionCounter
      };
    }),
  nextQuestion: () =>
    set((state) => {
      const nextQuestion = selectNextQuestion(
        state.questions,
        state.answeredQuestions,
        state.correctAnswers,
        state.questionCounter
      );
      return { currentQuestion: nextQuestion };
    }),
  resetQuiz: () =>
    set({
      currentQuestion: null,
      answeredQuestions: [],
      score: 0,
      correctAnswers: 0,
      questions: [],
      questionCounter: 0
    }),
  setCurrentQuestion: (question) =>
    set({ currentQuestion: question }),
}));