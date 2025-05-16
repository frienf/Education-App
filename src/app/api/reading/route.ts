import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Reading } from "@/lib/types/reading";

export async function GET() {
  const { data, error } = await supabase.from("readings").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Reading[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReading: Omit<Reading, "id"> = {
      title: body.title,
      author: body.author,
      date: body.date || new Date().toISOString().split("T")[0],
      rating: body.rating,
    };
    const { data, error } = await supabase
      .from("readings")
      .insert({ ...newReading, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Reading, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("readings")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Reading entry not found" }, { status: 404 });
    }
    return NextResponse.json(data as Reading);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("readings").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Reading entry deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}