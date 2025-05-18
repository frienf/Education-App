import { create } from "zustand";
import { Flashcard } from "@/lib/types/flashcard";

interface FlashcardState {
  flashcards: Flashcard[];
  fetchFlashcards: () => Promise<void>;
  addFlashcard: (flashcard: Omit<Flashcard, "id">) => Promise<void>;
  updateFlashcard: (flashcard: Flashcard) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  setFlashcards: (flashcards: Flashcard[]) => void;
}

export const useFlashcardStore = create<FlashcardState>((set) => ({
  flashcards: [],
  fetchFlashcards: async () => {
    try {
      const response = await fetch("/api/flashcards");
      if (!response.ok) throw new Error("Failed to fetch flashcards");
      const data = await response.json();
      set({ flashcards: data });
    } catch (error) {
      console.error("Fetch flashcards error:", error);
      throw error;
    }
  },
  addFlashcard: async (flashcard) => {
    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flashcard),
      });
      if (!response.ok) throw new Error("Failed to add flashcard");
      const newFlashcard = await response.json();
      set((state) => ({
        flashcards: [...state.flashcards, newFlashcard],
      }));
    } catch (error) {
      console.error("Add flashcard error:", error);
      throw error;
    }
  },
  updateFlashcard: async (flashcard) => {
    try {
      const response = await fetch("/api/flashcards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flashcard),
      });
      if (!response.ok) throw new Error("Failed to update flashcard");
      const updatedFlashcard = await response.json();
      set((state) => ({
        flashcards: state.flashcards.map((f) =>
          f.id === flashcard.id ? updatedFlashcard : f
        ),
      }));
    } catch (error) {
      console.error("Update flashcard error:", error);
      throw error;
    }
  },
  deleteFlashcard: async (id) => {
    try {
      const response = await fetch("/api/flashcards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete flashcard");
      set((state) => ({
        flashcards: state.flashcards.filter((f) => f.id !== id),
      }));
    } catch (error) {
      console.error("Delete flashcard error:", error);
      throw error;
    }
  },
  setFlashcards: (flashcards) => set({ flashcards }),
}));