"use client";

import { useLessonStore } from "@/lib/zustand/lessonStore";
import { Card, CardContent } from "@/components/ui/card";
import { Lesson } from "@/lib/types/lesson";
import { motion } from "framer-motion";
import { useRef } from "react";

type Props = {
  lesson: Lesson;
};

export default function LessonItem({ lesson }: Props) {
  const { updateLessonDate } = useLessonStore();
  const constraintsRef = useRef(null);

  const handleDragEnd = (_event: any, info: any) => {
    // Calculate new date based on drag position (simplified: 100px = 1 day)
    const daysOffset = Math.round(info.offset.y / 100);
    const newDate = new Date(lesson.date);
    newDate.setDate(newDate.getDate() + daysOffset);
    updateLessonDate(lesson.id, newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="relative pl-10" ref={constraintsRef}>
      {/* Timeline dot */}
      <div className="absolute left-3 top-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-y-1/2"></div>
      <motion.div
        drag="y"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        dragElastic={0.2}
        className="cursor-grab active:cursor-grabbing"
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">{lesson.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(lesson.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Duration: {lesson.duration} hour{lesson.duration > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}