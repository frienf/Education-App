"use client";

import { useQuizStore } from "@/lib/zustand/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function QuizResultsPage() {
  const { correctAnswers, answeredQuestions, resetQuiz, questions, questionCounter } = useQuizStore();
  const router = useRouter();

  const totalQuestions = questionCounter;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Get the questions that were answered
  const answeredQuestionsData = questions.filter(q => answeredQuestions.includes(q.id));

  useEffect(() => {
    // If no questions were answered, redirect back to quiz
    if (totalQuestions === 0) {
      router.push("/quiz");
    }
  }, [totalQuestions, router]);

  const handleRetry = () => {
    resetQuiz();
    router.push("/quiz");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="container mx-auto p-6 max-w-4xl flex-1 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl space-y-6"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex justify-center mb-4"
              >
                <Trophy className="h-16 w-16 text-yellow-500" />
              </motion.div>
              <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-6xl font-bold text-white"
                >
                  {percentage}%
                </motion.div>
                <p className="text-muted-foreground">
                  You got {correctAnswers} out of {totalQuestions} questions correct
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={handleHome}
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {answeredQuestionsData.map((question, index) => {
                const isCorrect = question.correctAnswer === question.selectedAnswer;
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{question.text}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Your answer: <span className={isCorrect ? "text-green-500" : "text-red-500"}>
                              {question.selectedAnswer}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-muted-foreground">
                              Correct answer: <span className="text-green-500">{question.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < answeredQuestionsData.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}