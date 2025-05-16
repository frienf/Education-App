"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Flashcard({ front, back }: { front: string; back: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="w-64 h-40 bg-white rounded-lg shadow-lg cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ perspective: 1000 }}
    >
      <div className="w-full h-full flex items-center justify-center p-4">
        {isFlipped ? back : front}
      </div>
    </motion.div>
  );
}