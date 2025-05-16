"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { QuizQuestion as QuestionType } from "@/lib/types/quiz";

type Props = {
  question: QuestionType;
  onAnswer: (answer: string) => void;
};

export default function QuizQuestion({ question, onAnswer }: Props) {
  return (
    <motion.div
      key={question.id}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => onAnswer(option)}
                className="w-full"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}