import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Lesson } from "@/lib/types/lesson";

export async function GET() {
  const { data, error } = await supabase.from("lessons").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Lesson[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLesson: Omit<Lesson, "id"> = {
      title: body.title,
      date: body.date,
      duration: body.duration,
    };
    const { data, error } = await supabase
      .from("lessons")
      .insert({ ...newLesson, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("lessons")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    return NextResponse.json(data as Lesson);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Lesson deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}