"use client";

import { useQuizStore } from "@/lib/zustand/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuizResultsPage() {
  const { score, correctAnswers, answeredQuestions, resetQuiz, fetchQuestions } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleRetakeQuiz = () => {
    resetQuiz();
    router.push("/quiz");
  };

  const percentage = answeredQuestions.length > 0 
    ? ((correctAnswers / answeredQuestions.length) * 100).toFixed(2) 
    : 0;

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-2">
            Score: {score} / {answeredQuestions.length}
          </p>
          <p className="text-lg mb-2">
            Correct Answers: {correctAnswers} ({percentage}%)
          </p>
          <p className="text-lg mb-4">
            Questions Attempted: {answeredQuestions.length}
          </p>
          <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}