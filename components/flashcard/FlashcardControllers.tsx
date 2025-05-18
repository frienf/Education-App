"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw } from "lucide-react";

interface FlashcardControllersProps {
  currentIndex: number;
  totalCards: number;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onReset: () => void;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardControllers({
  currentIndex,
  totalCards,
  onNext,
  onPrevious,
  onShuffle,
  onReset,
  isFlipped,
  onFlip,
}: FlashcardControllersProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="text-sm text-muted-foreground">
        Card {currentIndex + 1} of {totalCards}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onFlip}
            className="h-10 px-6 bg-primary hover:bg-primary/90"
          >
            {isFlipped ? "Show Front" : "Show Back"}
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentIndex === totalCards - 1}
            className="h-10 w-10"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Additional controls */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            onClick={onShuffle}
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 