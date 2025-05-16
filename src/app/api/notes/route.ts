import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Note } from "@/lib/types/note";

export async function GET() {
  const { data, error } = await supabase.from("notes").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Note[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNote: Omit<Note, "id" | "createdAt"> = {
      title: body.title,
      content: body.content,
    };
    const { data, error } = await supabase
      .from("notes")
      .insert({ ...newNote, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("notes")
      .update({ title: body.title, content: body.content })
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(data as Note);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}