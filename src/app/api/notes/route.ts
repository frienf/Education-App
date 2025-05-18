import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Note } from "@/lib/types/note";

export async function GET() {
  const { data, error } = await supabase.from("notes").select("*");
  if (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Note[]);
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newNote = {
      title: body.title,
      content: body.content,
      created_at: new Date().toISOString()
    };
    
    console.log("Attempting to insert note:", newNote);
    
    const { data, error } = await supabase
      .from("notes")
      .insert(newNote)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("No data returned after insert");
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 }
      );
    }

    console.log("Successfully created note:", data);
    return NextResponse.json(data as Note, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
      console.error("PUT Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(data as Note);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("DELETE Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}