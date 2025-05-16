import { create } from "zustand";
import { Lesson } from "@/lib/types/lesson";

type LessonState = {
  lessons: Lesson[];
  addLesson: (lesson: Lesson) => void;
  updateLessonDate: (id: string, date: string) => void;
};

// Sample lessons (replace with API call in production)
const sampleLessons: Lesson[] = [
  {
    id: "1",
    title: "Introduction to Algebra",
    date: "2025-05-18",
    duration: 2,
  },
  {
    id: "2",
    title: "Physics Basics",
    date: "2025-05-20",
    duration: 1,
  },
  {
    id: "3",
    title: "Essay Writing",
    date: "2025-05-22",
    duration: 3,
  },
];

export const useLessonStore = create<LessonState>((set) => ({
  lessons: sampleLessons,
  addLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
  updateLessonDate: (id, date) =>
    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, date } : lesson
      ),
    })),
}));