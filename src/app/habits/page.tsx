"use client";

import { useHabitStore } from "@/lib/zustand/habitStore";
import HabitItem from "@/components/habits/HabitItem";
import HabitProgress from "@/components/habits/HabitProgress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HabitsPage() {
  const { habits, addHabit, toggleHabit } = useHabitStore();
  const [newHabit, setNewHabit] = useState("");

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit({ id: Date.now().toString(), name: newHabit, completed: false });
      setNewHabit("");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Daily Habits</h1>
      <HabitProgress />
      <div className="my-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
          className="border rounded px-3 py-2 mr-2"
        />
        <Button onClick={handleAddHabit}>Add Habit</Button>
      </div>
      <div className="space-y-2">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggle={() => toggleHabit(habit.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}