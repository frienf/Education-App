import { create } from "zustand";
import { Flashcard } from "@/lib/types/spacedRepetition";
import { calculateNextReview } from "@/lib/utils/spacedRepetitionAlgo";

type SpacedRepetitionState = {
  cards: Flashcard[];
  cardsDue: Flashcard[];
  addCard: (card: Flashcard) => void;
  reviewCard: (id: string, rating: "hard" | "good" | "easy") => void;
};

// Sample cards (replace with API call in production)
const sampleCards: Flashcard[] = [
  {
    id: "1",
    front: "What is the capital of France?",
    back: "Paris",
    interval: 1,
    ease: 2.5,
    nextReview: "2025-05-17T00:00:00Z",
    reviews: 0,
    correctReviews: 0,
  },
  {
    id: "2",
    front: "What is 2 + 2?",
    back: "4",
    interval: 1,
    ease: 2.5,
    nextReview: "2025-05-17T00:00:00Z",
    reviews: 0,
    correctReviews: 0,
  },
];

export const useSpacedRepetitionStore = create<SpacedRepetitionState>((set) => ({
  cards: sampleCards,
  cardsDue: sampleCards.filter(
    (card) => new Date(card.nextReview) <= new Date()
  ),
  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
      cardsDue: [...state.cardsDue, card].filter(
        (c) => new Date(c.nextReview) <= new Date()
      ),
    })),
  reviewCard: (id, rating) =>
    set((state) => {
      const card = state.cards.find((c) => c.id === id);
      if (!card) return state;

      const { interval, ease, nextReview, isCorrect } = calculateNextReview(
        card,
        rating
      );

      const updatedCard = {
        ...card,
        interval,
        ease,
        nextReview,
        reviews: card.reviews + 1,
        correctReviews: isCorrect ? card.correctReviews + 1 : card.correctReviews,
      };

      const updatedCards = state.cards.map((c) =>
        c.id === id ? updatedCard : c
      );

      return {
        cards: updatedCards,
        cardsDue: updatedCards.filter(
          (c) => new Date(c.nextReview) <= new Date()
        ),
      };
    }),
}));