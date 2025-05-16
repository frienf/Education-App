"use client";

import { useReadingStore } from "@/lib/zustand/readingStore";
import ReadingTable from "@/components/reading/ReadingTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Reading Log</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
        />
        <Button onClick={handleAddReading}>Add Book</Button>
      </div>
      <ReadingTable readings={readings} />
    </motion.div>
  );
}