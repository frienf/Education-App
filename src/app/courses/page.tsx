"use client";

import { useCourseStore } from "@/lib/zustand/courseStore";
import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  topic: z.string().min(1, "Topic is required").max(50, "Topic is too long"),
  estimatedTime: z
    .number({ invalid_type_error: "Estimated time must be a number" })
    .positive("Estimated time must be positive"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
});

export default function CoursesPage() {
  const {
    filteredCourses,
    topics,
    timeRanges,
    selectedTopic,
    selectedTime,
    setTopic,
    setTime,
    addCourse,
    fetchCourses,
  } = useCourseStore();
  const [title, setTitle] = useState("");
  const [topic, setFormTopic] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof courseSchema>, string>>>({});

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleAddCourse = async () => {
    setErrors({});
    setIsSubmitting(true);

    const data = {
      title: title.trim(),
      topic: topic.trim(),
      estimatedTime: Number(estimatedTime),
      description: description.trim(),
    };

    const parsed = courseSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        topic: fieldErrors.topic?.[0],
        estimatedTime: fieldErrors.estimatedTime?.[0],
        description: fieldErrors.description?.[0],
      });
      toast.error("Please fix the form errors");
      setIsSubmitting(false);
      return;
    }

    try {
      await addCourse(parsed.data);
      toast.success("Course added successfully");
      setTitle("");
      setFormTopic("");
      setEstimatedTime("");
      setDescription("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add course";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Course Catalog</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select value={selectedTopic} onValueChange={setTopic}>
          <SelectTrigger>
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTime} onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(errors.title && "border-red-500")}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Topic"
            value={topic}
            onChange={(e) => setFormTopic(e.target.value)}
            className={cn(errors.topic && "border-red-500")}
          />
          {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Estimated Time (hours)"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className={cn(errors.estimatedTime && "border-red-500")}
          />
          {errors.estimatedTime && (
            <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(errors.description && "border-red-500")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <Button onClick={handleAddCourse} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Course"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500 col-span-full">No courses available.</p>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </motion.div>
  );
}