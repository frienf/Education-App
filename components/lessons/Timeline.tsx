"use client";

import { useLessonStore } from "@/lib/zustand/lessonStore";
import LessonItem from "@/components/lessons/LessonItem";
import { motion } from "framer-motion";

export default function Timeline() {
  const { lessons } = useLessonStore();

  // Sort lessons by date
  const sortedLessons = [...lessons].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-300"></div>
      <div className="space-y-4">
        {sortedLessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LessonItem lesson={lesson} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}