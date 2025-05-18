import { create } from "zustand";
import { Flashcard } from "@/lib/types/spacedRepetition";
import { calculateNextReview } from "@/lib/utils/spacedRepetitionAlgo";

type SpacedRepetitionState = {
  cards: Flashcard[];
  cardsDue: Flashcard[];
  fetchCards: () => Promise<void>;
  addCard: (card: Omit<Flashcard, "id" | "reviews" | "correctReviews">) => Promise<void>;
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
      const response = await fetch("/api/spaced-repetition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      const addedCard = await response.json();
      
      // Update both cards and cardsDue arrays
      set((state) => {
        const newCards = [...state.cards, addedCard];
        const newCardsDue = newCards.filter(
          (c) => new Date(c.nextReview) <= new Date()
        );
        return {
          cards: newCards,
          cardsDue: newCardsDue,
        };
      });
    } catch (error) {
      console.error("Failed to add flashcard:", error);
      throw error;
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
      set((state) => {
        const newCards = state.cards.map((c) => (c.id === id ? savedCard : c));
        const newCardsDue = newCards.filter(
          (c) => new Date(c.nextReview) <= new Date()
        );
        return {
          cards: newCards,
          cardsDue: newCardsDue,
        };
      });
    } catch (error) {
      console.error("Failed to review flashcard:", error);
      throw error;
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
      throw error;
    }
  },
}));