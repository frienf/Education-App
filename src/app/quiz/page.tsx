"use client";

import { useQuizStore } from "@/lib/zustand/quizStore";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuizPage() {
  const { currentQuestion, selectAnswer, nextQuestion, fetchQuestions } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = (answer: string) => {
    selectAnswer(answer);
    if (currentQuestion) {
      nextQuestion();
    } else {
      router.push("/quiz/results");
    }
  };

  if (!currentQuestion) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Adaptive Quiz</h1>
      <p className="text-sm text-gray-500 mb-4">
        Difficulty: {currentQuestion.difficulty}
      </p>
      <QuizQuestion question={currentQuestion} onAnswer={handleAnswer} />
    </motion.div>
  );
}