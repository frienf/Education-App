import { create } from "zustand";
import { Lesson } from "@/lib/types/lesson";

type LessonState = {
  lessons: Lesson[];
  fetchLessons: () => Promise<void>;
  addLesson: (lesson: Omit<Lesson, "id">) => Promise<void>;
  updateLessonDate: (id: string, date: string) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
};

export const useLessonStore = create<LessonState>((set) => ({
  lessons: [],
  fetchLessons: async () => {
    try {
      const response = await fetch("/api/lessons");
      const data = await response.json();
      set({ lessons: data });
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  },
  addLesson: async (lesson) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });
      const newLesson = await response.json();
      set((state) => ({ lessons: [...state.lessons, newLesson] }));
    } catch (error) {
      console.error("Failed to add lesson:", error);
    }
  },
  updateLessonDate: async (id, date) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, date }),
      });
      const updatedLesson = await response.json();
      set((state) => ({
        lessons: state.lessonStore.map((l) => (l.id === id ? updatedLesson : l)),
      }));
    } catch (error) {
      console.error("Failed to update lesson date:", error);
    }
  },
  deleteLesson: async (id) => {
    try {
      await fetch("/api/lessons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => ({ lessons: state.lessons.filter((l) => l.id !== id) }));
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  },
}));