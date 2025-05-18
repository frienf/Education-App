import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Flashcard } from "@/lib/types/spacedRepetition";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("spaced_repetition")
      .select("*")
      .order("next_review", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const card = await request.json();

    // First, create a flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from("flashcards")
      .insert({
        front: card.front,
        back: card.back,
        tags: []
      })
      .select()
      .single();

    if (flashcardError) {
      console.error("Error creating flashcard:", flashcardError);
      throw flashcardError;
    }

    // Then create the spaced repetition entry using the flashcard's ID
    const { data, error } = await supabase
      .from("spaced_repetition")
      .insert({
        id: flashcard.id,
        front: card.front,
        back: card.back,
        interval: Math.floor(card.interval || 1),
        ease: parseFloat((card.ease || 2.5).toString()),
        next_review: card.nextReview,
        reviews: 0,
        correct_reviews: 0,
        difficulty: card.difficulty || 'medium'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating spaced repetition entry:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding flashcard:", error);
    return NextResponse.json(
      { error: "Failed to add flashcard" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const card = await request.json();

    const { data, error } = await supabase
      .from("spaced_repetition")
      .update({
        interval: Math.floor(card.interval),
        ease: parseFloat(card.ease.toString()),
        next_review: card.nextReview,
        reviews: card.reviews,
        correct_reviews: card.correctReviews,
        last_reviewed: new Date().toISOString(),
        difficulty: card.difficulty
      })
      .eq("id", card.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from("spaced_repetition")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard" },
      { status: 500 }
    );
  }
}