import { create } from "zustand";
import { Habit } from "@/lib/types/habit";

type HabitState = {
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id">) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
};

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  fetchHabits: async () => {
    try {
      const response = await fetch("/api/habits");
      const data = await response.json();
      set({ habits: data });
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    }
  },
  addHabit: async (habit) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      });
      const newHabit = await response.json();
      set((state) => ({ habits: [...state.habits, newHabit] }));
    } catch (error) {
      console.error("Failed to add habit:", error);
    }
  },
  toggleHabit: async (id) => {
    try {
      const habit = (await useHabitStore.getState()).habits.find((h) => h.id === id);
      if (!habit) return;
      const response = await fetch("/api/habits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !habit.completed }),
      });
      const updatedHabit = await response.json();
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
      }));
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  },
  deleteHabit: async (id) => {
    try {
      await fetch("/api/habits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  },
}));