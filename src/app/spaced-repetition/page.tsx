"use client";

import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import ReviewCard from "@/components/spaced-repetition/ReviewCard";
import StatsDashboard from "@/components/spaced-repetition/StatsDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SpacedRepetitionPage() {
  const { cardsDue, addCard, fetchCards } = useSpacedRepetitionStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleAddCard = () => {
    if (front.trim() && back.trim()) {
      addCard({ front, back });
      setFront("");
      setBack("");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Spaced Repetition Flashcards</h1>
      <StatsDashboard />
      <div className="my-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Front (Question)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Input
          placeholder="Back (Answer)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <Button onClick={handleAddCard}>Add Card</Button>
      </div>
      {cardsDue.length === 0 ? (
        <p className="text-gray-500">No cards due for review.</p>
      ) : (
        <ReviewCard />
      )}
    </motion.div>
  );
}