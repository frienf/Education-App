"use client";

import { useNoteStore } from "@/lib/zustand/noteStore";
import MarkdownEditor from "@/components/notes/MarkdownEditor";
import LivePreview from "@/components/notes/LivePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const { notes, addNote, selectNote, selectedNoteId, fetchNotes } = useNoteStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      addNote({
        title,
        content,
      });
      setTitle("");
      setContent("");
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "No date";
    }
    
    try {
      // Handle PostgreSQL timestamp format
      const date = new Date(dateString.replace('+00', 'Z'));
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Markdown Notes</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Note Title"
          value={title ?? ""}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={handleSave}>Save Note</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarkdownEditor
          content={content ?? ""}
          onChange={setContent}
        />
        <LivePreview content={content ?? ""} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Saved Notes</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <motion.div
              key={`note-${note.id}`}
              className={`p-2 border rounded cursor-pointer ${selectedNoteId === note.id ? "bg-gray-100" : ""}`}
              onClick={() => {
                selectNote(note.id);
                setTitle(note.title ?? "");
                setContent(note.content ?? "");
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-medium">{note.title}</p>
              <p className="text-sm text-gray-500">
                {formatDate(note.createdAt)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}