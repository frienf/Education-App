import { create } from "zustand";
import { Reading } from "@/lib/types/reading";

type ReadingState = {
  readings: Reading[];
  sortKey: keyof Reading;
  sortOrder: "asc" | "desc";
  fetchReadings: () => Promise<void>;
  addReading: (reading: Omit<Reading, "id">) => Promise<void>;
  updateReading: (id: string, updates: Partial<Reading>) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
  sortReadings: (key: keyof Reading) => void;
};

export const useReadingStore = create<ReadingState>((set) => ({
  readings: [],
  sortKey: "date",
  sortOrder: "desc",
  fetchReadings: async () => {
    try {
      const response = await fetch("/api/reading");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set((state) => ({
        readings: data.sort((a: Reading, b: Reading) => {
          const aValue = a[state.sortKey];
          const bValue = b[state.sortKey];
          return state.sortOrder === "asc"
            ? aValue < bValue ? -1 : 1
            : aValue > bValue ? -1 : 1;
        }),
      }));
    } catch (error) {
      console.error("Failed to fetch readings:", error);
      throw error;
    }
  },
  addReading: async (reading) => {
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reading),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newReading = await response.json();
      set((state) => ({
        readings: [...state.readings, newReading].sort((a, b) => {
          const aValue = a[state.sortKey];
          const bValue = b[state.sortKey];
          return state.sortOrder === "asc"
            ? aValue < bValue ? -1 : 1
            : aValue > bValue ? -1 : 1;
        }),
      }));
    } catch (error) {
      console.error("Failed to add reading:", error);
      throw error;
    }
  },
  updateReading: async (id, updates) => {
    try {
      const response = await fetch("/api/reading", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedReading = await response.json();
      set((state) => ({
        readings: state.readings
          .map((r) => (r.id === id ? updatedReading : r))
          .sort((a, b) => {
            const aValue = a[state.sortKey];
            const bValue = b[state.sortKey];
            return state.sortOrder === "asc"
              ? aValue < bValue ? -1 : 1
              : aValue > bValue ? -1 : 1;
          }),
      }));
    } catch (error) {
      console.error("Failed to update reading:", error);
      throw error;
    }
  },
  deleteReading: async (id) => {
    try {
      const response = await fetch("/api/reading", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      set((state) => ({
        readings: state.readings.filter((r) => r.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete reading:", error);
      throw error;
    }
  },
  sortReadings: (key) =>
    set((state) => {
      const isSameKey = state.sortKey === key;
      const newOrder = isSameKey && state.sortOrder === "asc" ? "desc" : "asc";
      const sortedReadings = [...state.readings].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) return newOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return newOrder === "asc" ? 1 : -1;
        return 0;
      });
      return { readings: sortedReadings, sortKey: key, sortOrder: newOrder };
    }),
}));