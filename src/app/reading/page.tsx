"use client";

import { useReadingStore } from "@/lib/zustand/readingStore";
import ReadingTable from "@/components/reading/ReadingTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, Star, Plus, BookMarked } from "lucide-react";

export default function ReadingPage() {
  const { readings, addReading, fetchReadings } = useReadingStore();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const handleAddReading = () => {
    if (title.trim() && author.trim()) {
      addReading({
        title,
        author,
        date: new Date().toISOString().split("T")[0],
        rating,
      });
      setTitle("");
      setAuthor("");
      setRating(1);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/30 rounded-full blur-lg" />
          <BookOpen className="w-12 h-12 text-white drop-shadow-lg relative z-10" />
        </motion.div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Reading Log
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded-full" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
            <Plus className="w-6 h-6 text-white drop-shadow-md relative z-10" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Add New Book
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <BookMarked className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <Input
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 bg-white/5 transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <div className="relative">
            <BookOpen className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <Input
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="pl-10 bg-white/5 transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <div className="relative">
            <Star className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <Input
              type="number"
              placeholder="Rating (1-5)"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              className="pl-10 bg-white/5 transition-all duration-200 hover:border-primary/50 focus:border-primary"
            />
          </div>
          <Button 
            onClick={handleAddReading}
            className="h-10 px-4 text-base w-32 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-primary/20"
          >
            Add Book
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/10"
      >
        <ReadingTable />
      </motion.div>
    </motion.div>
  );
}