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
import { BookOpen, Clock, Filter, Plus } from "lucide-react";

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
    } catch {
      toast.error("Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/30 rounded-full blur-lg" />
          <BookOpen className="w-12 h-12 text-white drop-shadow-lg relative z-10" />
        </motion.div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Course Catalog
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded-full" />
        </div>
      </motion.div>

      <motion.div 
        className="bg-card rounded-lg shadow-lg p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/30 rounded-full blur-sm" />
            <Filter className="w-5 h-5 text-white drop-shadow-sm relative z-10" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Filter Courses
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedTopic} onValueChange={setTopic}>
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
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
      </motion.div>

      <motion.div 
        className="bg-card rounded-lg shadow-lg p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/30 rounded-full blur-sm" />
            <Plus className="w-5 h-5 text-white drop-shadow-sm relative z-10" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Add New Course
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "transition-all duration-200",
                errors.title ? "border-red-500" : "hover:border-primary/50 focus:border-primary"
              )}
            />
            {errors.title && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.title}
              </motion.p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Topic"
              value={topic}
              onChange={(e) => setFormTopic(e.target.value)}
              className={cn(
                "transition-all duration-200",
                errors.topic ? "border-red-500" : "hover:border-primary/50 focus:border-primary"
              )}
            />
            {errors.topic && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.topic}
              </motion.p>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white drop-shadow-sm" />
              <Input
                type="number"
                placeholder="Estimated Time (hours)"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className={cn(
                  "pl-10 transition-all duration-200",
                  errors.estimatedTime ? "border-red-500" : "hover:border-primary/50 focus:border-primary"
                )}
              />
            </div>
            {errors.estimatedTime && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.estimatedTime}
              </motion.p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                "transition-all duration-200",
                errors.description ? "border-red-500" : "hover:border-primary/50 focus:border-primary"
              )}
            />
            {errors.description && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.description}
              </motion.p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleAddCourse} 
            disabled={isSubmitting}
            className="min-w-[120px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
          >
            {isSubmitting ? "Adding..." : "Add Course"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <motion.p 
            className="text-muted-foreground col-span-full text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No courses available.
          </motion.p>
        ) : (
          filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}