import Flashcard from "@/components/flashcard/Flashcard";
import { useFlashcardStore } from "@/lib/zustand/flashcardStore";

export default function FlashcardsPage() {
  const { flashcards, addFlashcard } = useFlashcardStore();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() =>
          addFlashcard({ id: "1", front: "Question", back: "Answer" })
        }
      >
        Add Flashcard
      </button>
      <div className="grid grid-cols-3 gap-4">
        {flashcards.map((card) => (
          <Flashcard key={card.id} front={card.front} back={card.back} />
        ))}
      </div>
    </div>
  );
}