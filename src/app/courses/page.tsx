"use client";

import { useCourseStore } from "@/lib/zustand/courseStore";
import CourseCard from "@/components/courses/CourseCard";
import FilterPanel from "@/components/courses/FilterPanel";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const { filteredCourses } = useCourseStore();

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Course Catalog</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <FilterPanel />
        <div className="flex-1">
          {filteredCourses.length === 0 ? (
            <p className="text-gray-500">No courses match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}