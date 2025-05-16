import { create } from "zustand";
import { Note } from "@/lib/types/note";

type NoteState = {
  notes: Note[];
  selectedNoteId: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (id: string) => void;
};

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  selectedNoteId: null,
  fetchNotes: async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      set({ notes: data });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  },
  addNote: async (note) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const newNote = await response.json();
      set((state) => ({ notes: [...state.notes, newNote] }));
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  },
  updateNote: async (id, updates) => {
    try {
      const response = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const updatedNote = await response.json();
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? updatedNote : n)),
      }));
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  },
  deleteNote: async (id) => {
    try {
      await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
      }));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  },
  selectNote: (id) => set({ selectedNoteId: id }),
}));