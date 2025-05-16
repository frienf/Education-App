"use client";
import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function FlashcardsPage() {
  const { flashcards, fetchFlashcards } = useFlashcardStore();
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.length === 0 ? (
          <p className="text-gray-500 col-span-full">No flashcards available.</p>
        ) : (
          flashcards.map((flashcard) => (
            <Link key={flashcard.id} href={`/flashcards/${flashcard.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{flashcard.front}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{flashcard.back}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}