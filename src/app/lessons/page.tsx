"use client";

import { useLessonStore } from "@/lib/zustand/lessonStore";
import Timeline from "@/components/lessons/Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LessonsPage() {
  const { addLesson } = useLessonStore();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(1);

  const handleAddLesson = () => {
    if (title.trim() && duration > 0) {
      addLesson({
        id: Date.now().toString(),
        title,
        date: new Date().toISOString().split("T")[0],
        duration,
      });
      setTitle("");
      setDuration(1);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Lesson Tracker</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Duration (hours)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
        />
        <Button onClick={handleAddLesson}>Add Lesson</Button>
      </div>
      <Timeline />
    </motion.div>
  );
}