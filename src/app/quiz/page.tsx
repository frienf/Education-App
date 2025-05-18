"use client";

import { useQuizStore } from "@/lib/zustand/quizStore";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectNextQuestion } from "@/lib/utils/adaptiveQuizLogic";

export default function QuizPage() {
  const { 
    currentQuestion, 
    selectAnswer, 
    nextQuestion, 
    fetchQuestions, 
    answeredQuestions, 
    questions,
    correctAnswers,
    setCurrentQuestion,
    questionCounter,
    resetQuiz
  } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    resetQuiz();
    fetchQuestions();
  }, [fetchQuestions, resetQuiz]);

  const handleAnswer = (answer: string) => {
    // Check if this was the last question before selecting answer
    if (questionCounter >= questions.length - 1) {
      selectAnswer(answer);
      router.push("/quiz/results");
      return;
    }

    // Select answer and get the next question
    selectAnswer(answer);
    
    // Use adaptive logic to select the next question
    const nextQuestion = selectNextQuestion(
      questions,
      answeredQuestions,
      correctAnswers,
      questionCounter
    );

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      router.push("/quiz/results");
    }
  };

  if (!currentQuestion) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Loading Quiz...</h1>
          <p className="text-muted-foreground">Preparing your adaptive quiz experience</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(currentQuestion.options)) {
    console.error("Question options is not an array:", currentQuestion);
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error Loading Question</h1>
          <p className="text-muted-foreground">There was an error loading the question. Please try again.</p>
          <Button onClick={() => fetchQuestions()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Adaptive Quiz</h1>
          <div className="text-sm text-muted-foreground">
            Question {questionCounter + 1} of {questions.length}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary">
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10">
            Score: {correctAnswers}/{questionCounter || 0}
          </div>
        </div>

        <QuizQuestion question={currentQuestion} onAnswer={handleAnswer} />
      </div>
    </motion.div>
  );
}