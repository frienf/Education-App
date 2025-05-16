"use client";

import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ReviewCard() {
  const { cardsDue, reviewCard } = useSpacedRepetitionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cardsDue.length === 0 || currentIndex >= cardsDue.length) {
    return null;
  }

  const card = cardsDue[currentIndex];

  const handleRating = (rating: "hard" | "good" | "easy") => {
    reviewCard(card.id, rating);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="flex justify-center">
      <motion.div
        className="w-80"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ perspective: 1000 }}
      >
        <Card className="h-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <CardHeader>
            <CardTitle>{isFlipped ? "Answer" : "Question"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-lg">{isFlipped ? card.back : card.front}</p>
          </CardContent>
        </Card>
      </motion.div>
      {isFlipped && (
        <motion.div
          className="mt-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="destructive" onClick={() => handleRating("hard")}>
            Hard
          </Button>
          <Button variant="default" onClick={() => handleRating("good")}>
            Good
          </Button>
          <Button variant="secondary" onClick={() => handleRating("easy")}>
            Easy
          </Button>
        </motion.div>
      )}
    </div>
  );
}