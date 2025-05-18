"use client";

import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import Flashcard from "@/components/flashcard/Flashcard";
import FlashcardControllers from "@/components/flashcard/FlashcardControllers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, BookOpen, Shuffle } from "lucide-react";

export default function FlashcardsPage() {
  const { flashcards, addFlashcard, fetchFlashcards, setFlashcards } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const handleAddFlashcard = async () => {
    try {
    if (front.trim() && back.trim()) {
        await addFlashcard({ front, back });
      setFront("");
      setBack("");
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error adding flashcard:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    if (flashcards.length <= 1) return;
    
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
    <motion.div
        className="container mx-auto p-8 max-w-4xl flex-1 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <div className="flex items-center justify-between mb-12">
          <motion.h1 
            className="text-3xl font-bold flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BookOpen className="h-8 w-8 text-white" />
            Flashcards
          </motion.h1>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Button 
              onClick={() => setIsAdding(!isAdding)}
              className="h-10 px-4 text-base w-32 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-primary/20"
            >
              <Plus className="h-5 w-5 mr-2 text-white" />
              New Card
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-16"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader className="pb-6">
                  <CardTitle>Add New Flashcard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
        <Input
                      placeholder="Front of card"
          value={front}
          onChange={(e) => setFront(e.target.value)}
                      className="bg-background/50"
        />
        <Input
                      placeholder="Back of card"
          value={back}
          onChange={(e) => setBack(e.target.value)}
                      className="bg-background/50"
        />
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleAddFlashcard}
                        className="h-10 px-4 text-base w-32 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-primary/20"
                        disabled={!front.trim() || !back.trim()}
                      >
                        <Plus className="h-5 w-5 mr-2 text-white" />
                        Add Card
                      </Button>
                    </div>
      </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      {flashcards.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 flex items-center justify-center py-16"
          >
            <p className="text-muted-foreground text-lg">
              No flashcards available. Create your first one!
            </p>
          </motion.div>
      ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center gap-12 mt-12"
          >
            <div className="w-full max-w-2xl">
          <Flashcard
            front={flashcards[currentIndex]?.front || ""}
            back={flashcards[currentIndex]?.back || ""}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>
            
            <FlashcardControllers
              currentIndex={currentIndex}
              totalCards={flashcards.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onShuffle={handleShuffle}
              onReset={handleReset}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </motion.div>
      )}
    </motion.div>
    </div>
  );
}