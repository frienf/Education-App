"use client";

import { useReadingStore } from "@/lib/zustand/readingStore";
import ReadingTable from "@/components/reading/ReadingTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ReadingPage() {
  const { addReading } = useReadingStore();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddReading = () => {
    if (title.trim() && author.trim() && rating > 0) {
      addReading({
        id: Date.now().toString(),
        title,
        author,
        date: new Date().toISOString().split("T")[0],
        rating,
      });
      setTitle("");
      setAuthor("");
      setRating(0);
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
        <div className="flex items-center gap-2">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <Button onClick={handleAddReading}>Add Book</Button>
        </div>
      </div>
      <ReadingTable />
    </motion.div>
  );
}