"use client";

import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import { useCourseStore } from "@/lib/zustand/courseStore";
import { useHabitStore } from "@/lib/zustand/habitStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { Book, Clock, CheckCircle, PenTool, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function HomePage() {
  const { flashcards = [], fetchFlashcards } = useFlashcardStore();
  const { cards: spacedFlashcards = [], fetchCards: fetchSpacedFlashcards } = useSpacedRepetitionStore();
  const { courses = [], fetchCourses } = useCourseStore();
  const { habits = [], fetchHabits } = useHabitStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMounted = useRef(true);

  const initializeData = async () => {
    if (isInitialized) return;
    
    try {
      setIsLoading(true);
      setHasError(false);
      
      await Promise.all([
        fetchFlashcards().catch((err) => {
          console.error("Flashcards fetch error:", err);
          return null;
        }),
        fetchSpacedFlashcards().catch((err) => {
          console.error("Spaced flashcards fetch error:", err);
          return null;
        }),
        fetchCourses().catch((err) => {
          console.error("Courses fetch error:", err);
          return null;
        }),
        fetchHabits().catch((err) => {
          console.error("Habits fetch error:", err);
          return null;
        }),
      ]);

      if (isMounted.current) {
        setIsInitialized(true);
      }
    } catch (err) {
      console.error("Combined fetch error:", err);
      if (isMounted.current) {
        setHasError(true);
        toast.error("Failed to load data. Please try again later.");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to LearnHub</h2>
          <p className="text-muted-foreground mb-4">Click the button below to start loading your data</p>
          <Button 
            onClick={initializeData}
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            Initialize App
          </Button>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">Failed to load data. Please try again later.</p>
          <Button 
            onClick={initializeData}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your data</h2>
          <p className="text-muted-foreground mb-4">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  const dueSpacedFlashcards = Array.isArray(spacedFlashcards)
    ? spacedFlashcards.filter((f) => new Date(f.nextReview) <= new Date())
    : [];
  const incompleteHabits = Array.isArray(habits) ? habits.filter((h) => !h.completed) : [];
  const recentCourses = Array.isArray(courses) ? courses.slice(0, 3) : [];

  return (
    <motion.div
      className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="text-center mb-12 py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg border border-border/40 w-full max-w-4xl relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
              Welcome to LearnHub
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </motion.div>

          <motion.p
            className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
          >
            Master your skills with{" "}
            <span className="text-primary-foreground font-medium">flashcards</span>,{" "}
            <span className="text-secondary-foreground font-medium">spaced repetition</span>,{" "}
            <span className="text-primary-foreground font-medium">courses</span>, and{" "}
            <span className="text-secondary-foreground font-medium">habit tracking</span>.
          </motion.p>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-4"
          >
            <Link href="/courses">
              <Button 
                size="lg" 
                className="text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Learning
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-secondary/20 rounded-full"
          animate={{
            y: [0, 20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.section>

      <Separator className="mb-12 bg-border/40 w-full max-w-4xl" />

      {/* Feature Navigation */}
      <section className="mb-12 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Explore Features</h2>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {flashcards.length + dueSpacedFlashcards.length + courses.length + incompleteHabits.length} Total Items
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Flashcards", icon: Book, href: "/flashcards", count: flashcards.length },
            { title: "Spaced Repetition", icon: Clock, href: "/spaced-repetition", count: dueSpacedFlashcards.length },
            { title: "Courses", icon: PenTool, href: "/courses", count: courses.length },
            { title: "Habits", icon: CheckCircle, href: "/habits", count: incompleteHabits.length },
            { title: "Quiz", icon: HelpCircle, href: "/quiz", count: 0 },
          ].map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <motion.div
                className="h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-border/40 bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2 text-card-foreground">
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-5 w-5" />
                        {feature.title}
                      </div>
                      <Badge className="bg-primary text-primary-foreground">{feature.count}</Badge>
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

      <Separator className="mb-12 bg-border/40 w-full max-w-4xl" />

      {/* Dashboard Overview */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-foreground text-center">Your Learning Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Spaced Repetition Due */}
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Clock className="h-5 w-5" />
                Spaced Repetition
                {dueSpacedFlashcards.length > 0 && (
                  <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                    {dueSpacedFlashcards.length} Due
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dueSpacedFlashcards.length === 0 ? (
                <p className="text-muted-foreground">No flashcards due today.</p>
              ) : (
                <ul className="space-y-2">
                  {dueSpacedFlashcards.slice(0, 3).map((card) => (
                    <li key={card.id} className="truncate">
                      <Link href="/spaced-repetition" className="text-primary hover:text-primary/90 hover:underline">
                        {card.front}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {dueSpacedFlashcards.length > 0 && (
                <Link href="/spaced-repetition">
                  <Button variant="link" className="mt-2 text-primary hover:text-primary/90">
                    Review Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Incomplete Habits */}
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <CheckCircle className="h-5 w-5" />
                Habits
                {incompleteHabits.length > 0 && (
                  <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                    {incompleteHabits.length} Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incompleteHabits.length === 0 ? (
                <p className="text-muted-foreground">All habits completed!</p>
              ) : (
                <ul className="space-y-2">
                  {incompleteHabits.slice(0, 3).map((habit) => (
                    <li key={habit.id} className="truncate">
                      <Link href="/habits" className="text-primary hover:text-primary/90 hover:underline">
                        {habit.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {incompleteHabits.length > 0 && (
                <Link href="/habits">
                  <Button variant="link" className="mt-2 text-primary hover:text-primary/90">
                    View Habits
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <PenTool className="h-5 w-5" />
                Recent Courses
                {recentCourses.length > 0 && (
                  <Badge className="bg-primary text-primary-foreground">{recentCourses.length} Available</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCourses.length === 0 ? (
                <p className="text-muted-foreground">No courses available.</p>
              ) : (
                <ul className="space-y-2">
                  {recentCourses.map((course) => (
                    <li key={course.id} className="truncate">
                      <Link href="/courses" className="text-primary hover:text-primary/90 hover:underline">
                        {course.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/courses">
                <Button variant="link" className="mt-2 text-primary hover:text-primary/90">
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