import { create } from "zustand";
import { Habit } from "@/lib/types/habit";

type HabitState = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  toggleHabit: (id: string) => void;
};

export const useHabitStore = create<HabitState>((set) => ({
  habits: [
    { id: "1", name: "Drink water", completed: false },
    { id: "2", name: "Exercise", completed: false },
    { id: "3", name: "Read 10 pages", completed: false },
  ],
  addHabit: (habit) =>
    set((state) => ({ habits: [...state.habits, habit] })),
  toggleHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      ),
    })),
}));