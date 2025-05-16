import { create } from "zustand";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type FlashcardState = {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Flashcard) => void;
};

export const useFlashcardStore = create<FlashcardState>((set) => ({
  flashcards: [],
  addFlashcard: (flashcard) =>
    set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
}));