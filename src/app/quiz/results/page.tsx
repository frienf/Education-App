"use client";

import { useQuizStore } from "@/lib/zustand/quizStore";
import QuizResults from "@/components/quiz/QuizResults";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function QuizResultsPage() {
  const { score, questions, resetQuiz } = useQuizStore();
  const router = useRouter();

  const handleRetry = () => {
    resetQuiz();
    router.push("/quiz");
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <QuizResults score={score} total={questions.length} />
      <Button onClick={handleRetry} className="mt-4">
        Retry Quiz
      </Button>
    </motion.div>
  );
}