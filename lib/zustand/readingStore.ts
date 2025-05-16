import { create } from "zustand";
import { Reading } from "@/lib/types/reading";

type ReadingState = {
  readings: Reading[];
  sortKey: keyof Reading;
  sortOrder: "asc" | "desc";
  addReading: (reading: Reading) => void;
  sortReadings: (key: keyof Reading) => void;
};

// Sample readings (replace with API call in production)
const sampleReadings: Reading[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    date: "2025-01-15",
    rating: 5,
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    date: "2025-02-20",
    rating: 4,
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    date: "2025-03-10",
    rating: 3,
  },
];

export const useReadingStore = create<ReadingState>((set) => ({
  readings: sampleReadings,
  sortKey: "date",
  sortOrder: "desc",
  addReading: (reading) =>
    set((state) => ({ readings: [...state.readings, reading] })),
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