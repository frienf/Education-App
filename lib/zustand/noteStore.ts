import { create } from "zustand";
import { Note } from "@/lib/types/note";

type NoteState = {
  notes: Note[];
  selectedNoteId: string | null;
  addNote: (note: Note) => void;
  selectNote: (id: string) => void;
};

// Sample notes (replace with API call in production)
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "# Meeting Notes\n- Discuss project timeline\n- Assign tasks",
    createdAt: "2025-05-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Ideas",
    content: "## Brainstorming\n- New app feature\n- UI improvements",
    createdAt: "2025-05-12T14:30:00Z",
  },
];

export const useNoteStore = create<NoteState>((set) => ({
  notes: sampleNotes,
  selectedNoteId: null,
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  selectNote: (id) => set({ selectedNoteId: id }),
}));