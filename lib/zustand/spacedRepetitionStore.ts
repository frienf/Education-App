import { create } from "zustand";
import { Flashcard } from "@/lib/types/spacedRepetition";
import { calculateNextReview } from "@/lib/utils/spacedRepetitionAlgo";

type SpacedRepetitionState = {
  cards: Flashcard[];
  cardsDue: Flashcard[];
  fetchCards: () => Promise<void>;
  addCard: (card: Omit<Flashcard, "id" | "interval" | "ease" | "nextReview" | "reviews" | "correctReviews">) => Promise<void>;
  reviewCard: (id: string, rating: "hard" | "good" | "easy") => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
};

export const useSpacedRepetitionStore = create<SpacedRepetitionState>((set) => ({
  cards: [],
  cardsDue: [],
  fetchCards: async () => {
    try {
      const response = await fetch("/api/spaced-repetition");
      const data = await response.json();
      set({
        cards: data,
        cardsDue: data.filter(
          (card: Flashcard) => new Date(card.nextReview) <= new Date()
        ),
      });
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
    }
  },
  addCard: async (card) => {
    try {
      const newCard = {
        ...card,
        interval: 1,
        ease: 2.5,
        nextReview: new Date().toISOString(),
        reviews: 0,
        correctReviews: 0,
      };
      const response = await fetch("/api/spaced-repetition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const addedCard = await response.json();
      set((state) => ({
        cards: [...state.cards, addedCard],
        cardsDue: [...state.cardsDue, addedCard].filter(
          (c) => new Date(c.nextReview) <= new Date()
        ),
      }));
    } catch (error) {
      console.error("Failed to add flashcard:", error);
    }
  },
  reviewCard: async (id, rating) => {
    try {
      const card = (await useSpacedRepetitionStore.getState()).cards.find((c) => c.id === id);
      if (!card) return;
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
      const response = await fetch("/api/spaced-repetition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCard),
      });
      const savedCard = await response.json();
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? savedCard : c)),
        cardsDue: state.cards
          .map((c) => (c.id === id ? savedCard : c))
          .filter((c) => new Date(c.nextReview) <= new Date()),
      }));
    } catch (error) {
      console.error("Failed to review flashcard:", error);
    }
  },
  deleteCard: async (id) => {
    try {
      await fetch("/api/spaced-repetition", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => ({
        cards: state.cards.filter((c) => c.id !== id),
        cardsDue: state.cardsDue.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
    }
  },
}));