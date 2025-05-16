import { create } from "zustand";
import { Course } from "@/lib/types/course";

type CourseState = {
  courses: Course[];
  topics: string[];
  timeRanges: string[];
  selectedTopic: string;
  selectedTime: string;
  filteredCourses: Course[];
  setTopic: (topic: string) => void;
  setTime: (time: string) => void;
};

// Sample courses (replace with API call in production)
const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Algebra",
    topic: "Math",
    estimatedTime: 2,
    description: "Learn the basics of algebra.",
  },
  {
    id: "2",
    title: "Physics Fundamentals",
    topic: "Science",
    estimatedTime: 3,
    description: "Explore the principles of physics.",
  },
  {
    id: "3",
    title: "Calculus I",
    topic: "Math",
    estimatedTime: 4,
    description: "Dive into differential calculus.",
  },
  {
    id: "4",
    title: "Chemistry Basics",
    topic: "Science",
    estimatedTime: 1,
    description: "Understand chemical reactions.",
  },
];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: sampleCourses,
  topics: ["All", ...new Set(sampleCourses.map((c) => c.topic))],
  timeRanges: ["All", "<1 hour", "1-3 hours", ">3 hours"],
  selectedTopic: "All",
  selectedTime: "All",
  filteredCourses: sampleCourses,
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