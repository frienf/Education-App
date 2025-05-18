"use client";

import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import ReviewCard from "@/components/spaced-repetition/ReviewCard";
import StatsDashboard from "@/components/spaced-repetition/StatsDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { calculateNextReview } from "@/lib/utils/spacedRepetitionAlgo";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SpacedRepetitionPage() {
  const { cardsDue, addCard, fetchCards } = useSpacedRepetitionStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleAddCard = async () => {
    if (!front.trim() || !back.trim()) {
      toast.error("Please fill in both question and answer fields");
      return;
    }

    try {
      setIsAdding(true);
      // Calculate initial review date using the algorithm
      const initialReview = calculateNextReview({
        id: Date.now().toString(),
        front,
        back,
        interval: 1,
        ease: 2.5,
        nextReview: new Date().toISOString(),
        reviews: 0,
        correctReviews: 0,
        difficulty: 'medium'
      }, "good");

      await addCard({ 
        front, 
        back,
        nextReview: initialReview.nextReview,
        interval: initialReview.interval,
        ease: initialReview.ease,
        difficulty: 'medium' // Default difficulty
      });

      toast.success("Card added successfully!");
      setFront("");
      setBack("");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
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
      
      {/* Add New Card Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Front (Question)"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isAdding}
          />
          <Input
            placeholder="Back (Answer)"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isAdding}
          />
          <Button 
            onClick={handleAddCard}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Card"}
          </Button>
        </div>
      </Card>

      {/* Review Section */}
      <Card className="p-6 ">
        <h2 className="text-xl font-semibold mb-4">Review Cards</h2>
        {cardsDue.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No cards due for review.</p>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-4">
              {cardsDue.length} card{cardsDue.length !== 1 ? 's' : ''} due for review
            </p>
            <ReviewCard />
          </div>
        )}
      </Card>
    </motion.div>
  );
}