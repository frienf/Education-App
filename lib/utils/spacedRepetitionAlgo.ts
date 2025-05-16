import { Flashcard } from "@/lib/types/spacedRepetition";

export function calculateNextReview(
  card: Flashcard,
  rating: "hard" | "good" | "easy"
): {
  interval: number;
  ease: number;
  nextReview: string;
  isCorrect: boolean;
} {
  let newEase = card.ease;
  let newInterval = card.interval;
  let isCorrect = true;

  // Adjust ease and interval based on rating (inspired by SM-2)
  if (rating === "hard") {
    newEase = Math.max(1.3, card.ease - 0.3);
    newInterval = 1;
    isCorrect = false;
  } else if (rating === "good") {
    newEase = card.ease;
    newInterval = card.interval * card.ease;
  } else if (rating === "easy") {
    newEase = card.ease + 0.3;
    newInterval = card.interval * card.ease * 1.3;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + Math.round(newInterval));

  return {
    interval: newInterval,
    ease: newEase,
    nextReview: nextReviewDate.toISOString(),
    isCorrect,
  };
}