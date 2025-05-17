"use client";

import { useFlashcardStore } from "@/lib/zustand/flashcardStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";

const flashcardSchema = z.object({
  front: z.string().min(1, "Front is required").max(200, "Front is too long"),
  back: z.string().min(1, "Back is required").max(200, "Back is too long"),
});

export default function FlashcardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { flashcards, fetchFlashcards, updateFlashcard, deleteFlashcard } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof flashcardSchema>, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [cardHeight, setCardHeight] = useState(192); // Default 48rem
  const cardRef = useRef<HTMLDivElement>(null);

  // Find flashcard by id
  const flashcard = flashcards.find((f) => f.id === id);

  useEffect(() => {
    if (!flashcard) {
      fetchFlashcards().finally(() => setIsLoading(false));
    } else {
      setFront(flashcard.front);
      setBack(flashcard.back);
      setIsLoading(false);
    }
  }, [flashcard, fetchFlashcards]);

  // Update card height dynamically
  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.scrollHeight);
    }
  }, [flashcard, isFlipped]);

  const handleUpdate = async () => {
    setErrors({});
    setIsSubmitting(true);

    const data = { id: id as string, front: front.trim(), back: back.trim() };
    const parsed = flashcardSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        front: fieldErrors.front?.[0],
        back: fieldErrors.back?.[0],
      });
      toast.error("Please fix the form errors");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateFlashcard(data);
      toast.success("Flashcard updated successfully");
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update flashcard";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteFlashcard(id as string);
      toast.success("Flashcard deleted successfully");
      router.push("/flashcards");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete flashcard";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!flashcard) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Flashcard Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The requested flashcard does not exist.</p>
            <Link href="/flashcards">
              <Button variant="outline">Back to Flashcards</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/flashcards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Flashcard Details</h1>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? "Edit Flashcard" : flashcard.front}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <Label htmlFor="front" className="text-sm font-medium">
                    Front
                  </Label>
                  <Input
                    id="front"
                    placeholder="Enter front of flashcard"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    className={cn(
                      "mt-1",
                      errors.front && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.front && (
                    <p className="text-red-500 text-sm mt-1">{errors.front}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="back" className="text-sm font-medium">
                    Back
                  </Label>
                  <Textarea
                    id="back"
                    placeholder="Enter back of flashcard"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    className={cn(
                      "mt-1 min-h-[100px]",
                      errors.back && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.back && (
                    <p className="text-red-500 text-sm mt-1">{errors.back}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFront(flashcard.front);
                      setBack(flashcard.back);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFront(flashcard.front);
                      setBack(flashcard.back);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div
                  className="relative cursor-pointer perspective-1000"
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  aria-label={isFlipped ? "Show front of flashcard" : "Show back of flashcard"}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsFlipped(!isFlipped);
                    }
                  }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full"
                    style={{ height: `${cardHeight}px`, transformStyle: "preserve-3d" }}
                    ref={cardRef}
                  >
                    {/* Front Side */}
                    <motion.div
                      className={cn(
                        "absolute w-full h-full bg-white border rounded-lg p-4 flex items-center justify-center text-center",
                        isFlipped && "backface-hidden"
                      )}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-lg">{flashcard.front}</p>
                    </motion.div>
                    {/* Back Side */}
                    <motion.div
                      className={cn(
                        "absolute w-full h-full bg-white border rounded-lg p-4 flex items-center justify-center text-center",
                        !isFlipped && "backface-hidden"
                      )}
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <p className="text-lg">{flashcard.back}</p>
                    </motion.div>
                  </motion.div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click or press Enter to flip
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 hover:bg-primary/90 transition-colors"
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1 hover:bg-destructive/90 transition-colors"
                        disabled={isSubmitting}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this flashcard? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}