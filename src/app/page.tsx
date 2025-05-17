"use client";

import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import { useCourseStore } from "@/lib/zustand/courseStore";
import { useHabitStore } from "@/lib/zustand/habitStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Loader2, Book, Clock, CheckCircle, PenTool } from "lucide-react";
import toast from "react-hot-toast";
import { Flashcard } from "@/lib/types/spacedRepetition";

export default function HomePage() {
  const { flashcards, fetchFlashcards } = useFlashcardStore();
  const { cards: spacedFlashcards, fetchCards: fetchSpacedFlashcards } = useSpacedRepetitionStore();
  const { courses, fetchCourses } = useCourseStore();
  const { habits, fetchHabits } = useHabitStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchFlashcards(),
      fetchSpacedFlashcards(),
      fetchCourses(),
      fetchHabits(),
    ])
      .catch(() => toast.error("Failed to load some data"))
      .finally(() => setIsLoading(false));
  }, [fetchFlashcards, fetchSpacedFlashcards, fetchCourses, fetchHabits]);

  const dueSpacedFlashcards = spacedFlashcards.filter(
    (f: Flashcard) => new Date(f.nextReview) <= new Date()
  );
  const incompleteHabits = habits.filter((h) => !h.completed);
  const recentCourses = courses.slice(0, 3); // Show up to 3 recent courses

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="text-center mb-12 py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to LearnHub
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Master your skills with flashcards, spaced repetition, courses, and habit tracking.
        </motion.p>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/courses">
            <Button size="lg" className="text-lg">
              Start Learning
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Feature Navigation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Explore Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Flashcards", icon: Book, href: "/flashcards", count: flashcards.length },
            { title: "Spaced Repetition", icon: Clock, href: "/spaced-repetition", count: dueSpacedFlashcards.length },
            { title: "Courses", icon: PenTool, href: "/courses", count: courses.length },
            { title: "Habits", icon: CheckCircle, href: "/habits", count: incompleteHabits.length },
          ].map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <motion.div
                className="h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.count} {feature.title.toLowerCase()} {feature.title === "Spaced Repetition" ? "due" : "available"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dashboard Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Learning Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Spaced Repetition Due */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Spaced Repetition
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dueSpacedFlashcards.length === 0 ? (
                <p className="text-muted-foreground">No flashcards due today.</p>
              ) : (
                <ul className="space-y-2">
                  {dueSpacedFlashcards.slice(0, 3).map((card) => (
                    <li key={card.id} className="truncate">
                      <Link href="/spaced-repetition" className="hover:underline">
                        {card.front}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {dueSpacedFlashcards.length > 0 && (
                <Link href="/spaced-repetition">
                  <Button variant="link" className="mt-2">
                    Review Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Incomplete Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incompleteHabits.length === 0 ? (
                <p className="text-muted-foreground">All habits completed!</p>
              ) : (
                <ul className="space-y-2">
                  {incompleteHabits.slice(0, 3).map((habit) => (
                    <li key={habit.id} className="truncate">
                      <Link href="/habits" className="hover:underline">
                        {habit.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {incompleteHabits.length > 0 && (
                <Link href="/habits">
                  <Button variant="link" className="mt-2">
                    View Habits
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Recent Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCourses.length === 0 ? (
                <p className="text-muted-foreground">No courses available.</p>
              ) : (
                <ul className="space-y-2">
                  {recentCourses.map((course) => (
                    <li key={course.id} className="truncate">
                      <Link href="/courses" className="hover:underline">
                        {course.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/courses">
                <Button variant="link" className="mt-2">
                  Explore Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}