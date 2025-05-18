"use client";

import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function ReviewCard() {
  const { cardsDue, reviewCard } = useSpacedRepetitionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (cardsDue.length === 0 || currentIndex >= cardsDue.length) {
    return null;
  }

  const card = cardsDue[currentIndex];

  const handleRating = async (rating: "hard" | "good" | "easy") => {
    try {
      setIsTransitioning(true);
      await reviewCard(card.id, rating);
      
      // Show feedback based on rating
      if (rating === "hard") {
        toast.error("Keep practicing!");
      } else if (rating === "good") {
        toast.success("Well done!");
      } else {
        toast.success("Excellent!");
      }

      // Wait for animation to complete before moving to next card
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 500);
    } catch (error) {
      console.error("Error reviewing card:", error);
      toast.error("Failed to save review. Please try again.");
      setIsTransitioning(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-80"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ perspective: 1000 }}
      >
        <Card 
          className={`h-48 cursor-pointer transition-shadow hover:shadow-lg ${isTransitioning ? 'pointer-events-none' : ''}`}
          onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}
        >
          <CardHeader>
            <CardTitle>{isFlipped ? "Answer" : "Question"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-lg text-center">{isFlipped ? card.back : card.front}</p>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {isFlipped && !isTransitioning && (
          <motion.div
            className="mt-4 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="destructive" 
              onClick={() => handleRating("hard")}
              className="min-w-20"
            >
              Hard
            </Button>
            <Button 
              variant="default" 
              onClick={() => handleRating("good")}
              className="min-w-20"
            >
              Good
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleRating("easy")}
              className="min-w-20"
            >
              Easy
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}