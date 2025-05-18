"use client";

import { motion } from "framer-motion";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div 
      className="w-full max-w-2xl aspect-[4/3] cursor-pointer"
      onClick={onFlip}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          rotateY: isFlipped ? 180 : 0 
        }}
        transition={{ 
          duration: 0.6,
          scale: { duration: 0.4 },
          opacity: { duration: 0.4 }
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <motion.div 
          className="w-full h-full bg-black rounded-xl shadow-xl flex items-center justify-center p-8 text-center absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <motion.div 
            className="text-xl sm:text-2xl font-medium text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {front}
          </motion.div>
        </motion.div>

        {/* Back of card */}
        <motion.div 
          className="w-full h-full bg-black rounded-xl shadow-xl flex items-center justify-center p-8 text-center absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.div 
            className="text-xl sm:text-2xl font-medium text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {back}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}