import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Flashcard } from "@/lib/types/flashcard";

export async function GET() {
  const { data, error } = await supabase.from("flashcards").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Flashcard[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFlashcard: Omit<Flashcard, "id"> = {
      front: body.front,
      back: body.back,
    };
    const { data, error } = await supabase
      .from("flashcards")
      .insert({ ...newFlashcard, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Flashcard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }
    return NextResponse.json(data as Flashcard);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("flashcards").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Flashcard deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}