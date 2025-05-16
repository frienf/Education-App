import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Flashcard } from "@/lib/types/spacedRepetition";

export async function GET() {
  const { data, error } = await supabase.from("spaced_repetition").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Flashcard[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCard: Omit<
      Flashcard,
      "id" | "interval" | "ease" | "nextReview" | "reviews" | "correctReviews"
    > = {
      front: body.front,
      back: body.back,
    };
    const { data, error } = await supabase
      .from("spaced_repetition")
      .insert({
        ...newCard,
        id: Date.now().toString(),
        interval: 1,
        ease: 2.5,
        next_review: new Date().toISOString(),
        reviews: 0,
        correct_reviews: 0,
      })
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
      .from("spaced_repetition")
      .update({
        front: body.front,
        back: body.back,
        interval: body.interval,
        ease: body.ease,
        next_review: body.nextReview,
        reviews: body.reviews,
        correct_reviews: body.correctReviews,
      })
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
    const { error } = await supabase.from("spaced_repetition").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Flashcard deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}