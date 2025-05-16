import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { QuizQuestion } from "@/lib/types/quiz";

export async function GET() {
  const { data, error } = await supabase.from("quiz_questions").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as QuizQuestion[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newQuestion: Omit<QuizQuestion, "id"> = {
      text: body.text,
      options: body.options,
      correctAnswer: body.correctAnswer,
      difficulty: body.difficulty || "medium",
    };
    const { data, error } = await supabase
      .from("quiz_questions")
      .insert({ ...newQuestion, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as QuizQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("quiz_questions")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(data as QuizQuestion);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}