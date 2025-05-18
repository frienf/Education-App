import { create } from "zustand";
import { Course } from "@/lib/types/course";

type CourseState = {
  courses: Course[];
  topics: string[];
  timeRanges: string[];
  selectedTopic: string;
  selectedTime: string;
  filteredCourses: Course[];
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setTopic: (topic: string) => void;
  setTime: (time: string) => void;
};

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  topics: ["All"],
  timeRanges: ["All", "<1 hour", "1-3 hours", ">3 hours"],
  selectedTopic: "All",
  selectedTime: "All",
  filteredCourses: [],
  fetchCourses: async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      const topics = ["All", ...Array.from(new Set(data.map((c: Course) => c.topic))) as string[]];
      set({
        courses: data,
        topics,
        filteredCourses: data,
      });
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  },
  addCourse: async (course) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      const newCourse = await response.json();
      set((state) => {
        const updatedCourses = [...state.courses, newCourse];
        const topics = ["All", ...Array.from(new Set(updatedCourses.map((c) => c.topic))) as string[]];
        return {
          courses: updatedCourses,
          topics,
          filteredCourses: updatedCourses.filter(
            (c) =>
              (state.selectedTopic === "All" || c.topic === state.selectedTopic) &&
              (state.selectedTime === "All" ||
                (state.selectedTime === "<1 hour" && c.estimatedTime < 1) ||
                (state.selectedTime === "1-3 hours" &&
                  c.estimatedTime >= 1 &&
                  c.estimatedTime <= 3) ||
                (state.selectedTime === ">3 hours" && c.estimatedTime > 3))
          ),
        };
      });
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  },
  updateCourse: async (id, updates) => {
    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const updatedCourse = await response.json();
      set((state) => {
        const updatedCourses = state.courses.map((c) =>
          c.id === id ? updatedCourse : c
        );
        const topics = ["All", ...Array.from(new Set(updatedCourses.map((c) => c.topic))) as string[]];
        return {
          courses: updatedCourses,
          topics,
          filteredCourses: updatedCourses.filter(
            (c) =>
              (state.selectedTopic === "All" || c.topic === state.selectedTopic) &&
              (state.selectedTime === "All" ||
                (state.selectedTime === "<1 hour" && c.estimatedTime < 1) ||
                (state.selectedTime === "1-3 hours" &&
                  c.estimatedTime >= 1 &&
                  c.estimatedTime <= 3) ||
                (state.selectedTime === ">3 hours" && c.estimatedTime > 3))
          ),
        };
      });
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  },
  deleteCourse: async (id) => {
    try {
      await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => {
        const updatedCourses = state.courses.filter((c) => c.id !== id);
        const topics = ["All", ...Array.from(new Set(updatedCourses.map((c) => c.topic))) as string[]];
        return {
          courses: updatedCourses,
          topics,
          filteredCourses: updatedCourses.filter(
            (c) =>
              (state.selectedTopic === "All" || c.topic === state.selectedTopic) &&
              (state.selectedTime === "All" ||
                (state.selectedTime === "<1 hour" && c.estimatedTime < 1) ||
                (state.selectedTime === "1-3 hours" &&
                  c.estimatedTime >= 1 &&
                  c.estimatedTime <= 3) ||
                (state.selectedTime === ">3 hours" && c.estimatedTime > 3))
          ),
        };
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  },
  setTopic: (topic) =>
    set((state) => {
      const filtered = state.courses.filter(
        (course) =>
          (topic === "All" || course.topic === topic) &&
          (state.selectedTime === "All" ||
            (state.selectedTime === "<1 hour" && course.estimatedTime < 1) ||
            (state.selectedTime === "1-3 hours" &&
              course.estimatedTime >= 1 &&
              course.estimatedTime <= 3) ||
            (state.selectedTime === ">3 hours" && course.estimatedTime > 3))
      );
      return { selectedTopic: topic, filteredCourses: filtered };
    }),
  setTime: (time) =>
    set((state) => {
      const filtered = state.courses.filter(
        (course) =>
          (state.selectedTopic === "All" || course.topic === state.selectedTopic) &&
          (time === "All" ||
            (time === "<1 hour" && course.estimatedTime < 1) ||
            (time === "1-3 hours" &&
              course.estimatedTime >= 1 &&
              course.estimatedTime <= 3) ||
            (time === ">3 hours" && course.estimatedTime > 3))
      );
      return { selectedTime: time, filteredCourses: filtered };
    }),
}));