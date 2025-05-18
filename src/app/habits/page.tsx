"use client";

import { useHabitStore } from "@/lib/zustand/habitStore";
import HabitItem from "@/components/habits/HabitItem";
import HabitProgress from "@/components/habits/HabitProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Plus, Target, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HabitsPage() {
  const { habits, addHabit, toggleHabit, fetchHabits } = useHabitStore();
  const [newHabit, setNewHabit] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchHabits().finally(() => setIsLoading(false));
  }, [fetchHabits]);

  const handleAddHabit = async () => {
    if (!newHabit.trim()) return;
    
    setIsAdding(true);
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabit, completed: false }),
      });

      if (!response.ok) throw new Error("Failed to add habit");
      
      const habit = await response.json();
      addHabit(habit);
      setNewHabit("");
      toast.success("Habit added successfully!");
    } catch {
      toast.error("Failed to add habit");
      console.error("Error adding habit");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    try {
      const response = await fetch("/api/habits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: habitId,
          completed: !habit.completed,
        }),
      });

      if (!response.ok) throw new Error("Failed to update habit");
      
      const updatedHabit = await response.json();
      toggleHabit(updatedHabit.id);
    } catch {
      toast.error("Failed to update habit");
      console.error("Error updating habit");
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
        className="flex items-center gap-3 mb-12 relative"
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
          <Target className="w-12 h-12 text-white drop-shadow-lg relative z-10" />
        </motion.div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Daily Habits
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute right-0 top-0"
        >
          <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-16 border border-white/10"
      >
      <HabitProgress />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-16 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm" />
            <Plus className="w-5 h-5 text-white drop-shadow-sm relative z-10" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Add New Habit
          </h2>
        </div>
        <div className="flex gap-4">
          <Input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter a new habit"
            className="flex-1 transition-all duration-200 hover:border-primary/50 focus:border-primary bg-white/5"
            disabled={isAdding}
        />
          <Button 
            onClick={handleAddHabit}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-primary/20"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                Adding...
              </>
            ) : (
              "Add Habit"
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm space-y-2" />
            <CheckCircle2 className="w-5 h-5 text-white drop-shadow-sm relative z-10" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Your Habits
          </h2>
      </div>
        <div className="space-y-6">
          {isLoading ? (
            <motion.div 
              className="text-muted-foreground text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-white animate-spin drop-shadow-sm" />
              <p>Loading habits...</p>
            </motion.div>
          ) : habits.length === 0 ? (
            <motion.div 
              className="text-muted-foreground text-center py-12 space-y-2 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-white/50 drop-shadow-sm" />
              <p>No habits added yet. Start by adding your first habit!</p>
            </motion.div>
          ) : (
            habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="transition-all duration-200"
              >
          <HabitItem
            habit={habit}
                  onToggle={() => handleToggleHabit(habit.id)}
          />
              </motion.div>
            ))
          )}
      </div>
      </motion.div>
    </motion.div>
  );
}