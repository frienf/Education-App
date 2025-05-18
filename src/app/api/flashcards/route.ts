import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Flashcard } from "@/lib/types/flashcard";

export async function GET() {
  const { data, error } = await supabase.from("flashcards").select("*");
  if (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Flashcard[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received flashcard data:", body);

    if (!body.front || !body.back) {
      return NextResponse.json(
        { error: "Front and back content are required" },
        { status: 400 }
      );
    }

    const newFlashcard: Omit<Flashcard, "id"> = {
      front: body.front,
      back: body.back,
    };

    console.log("Attempting to insert flashcard:", newFlashcard);
    const { data, error } = await supabase
      .from("flashcards")
      .insert(newFlashcard)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Successfully created flashcard:", data);
    return NextResponse.json(data as Flashcard, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/flashcards:", error);
    return NextResponse.json(
      { error: "Failed to create flashcard" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("flashcards")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      console.error("Error updating flashcard:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }
    return NextResponse.json(data as Flashcard);
  } catch (error) {
    console.error("Error in PUT /api/flashcards:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("flashcards").delete().eq("id", id);
    if (error) {
      console.error("Error deleting flashcard:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Flashcard deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/flashcards:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}