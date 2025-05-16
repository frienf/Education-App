"use client";

import { useHabitStore } from "@/lib/zustand/habitStore";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function HabitProgress() {
  const { habits } = useHabitStore();
  const completedCount = habits.filter((habit) => habit.completed).length;
  const progress = habits.length ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Progress</h2>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      >
        <Progress value={progress} className="w-full" />
      </motion.div>
      <p className="text-sm text-gray-600 mt-1">
        {completedCount} of {habits.length} habits completed
      </p>
    </div>
  );
}