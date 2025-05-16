"use client";

import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import Flashcard from "@/components/flashcard/Flashcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FlashcardsPage() {
  const { flashcards, addFlashcard, fetchFlashcards } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const handleAddFlashcard = () => {
    if (front.trim() && back.trim()) {
      addFlashcard({ front, back });
      setFront("");
      setBack("");
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Input
          placeholder="Back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <Button onClick={handleAddFlashcard}>Add Flashcard</Button>
      </div>
      {flashcards.length === 0 ? (
        <p className="text-gray-500">No flashcards available.</p>
      ) : (
        <div>
          <Flashcard
            front={flashcards[currentIndex]?.front || ""}
            back={flashcards[currentIndex]?.back || ""}
          />
          <Button onClick={handleNext} className="mt-4">
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}