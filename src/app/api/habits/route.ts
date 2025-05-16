import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Habit } from "@/lib/types/habit";

export async function GET() {
  const { data, error } = await supabase.from("habits").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Habit[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newHabit: Omit<Habit, "id"> = {
      name: body.name,
      completed: body.completed || false,
    };
    const { data, error } = await supabase
      .from("habits")
      .insert({ ...newHabit, id: Date.now().toString() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Habit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("habits")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    return NextResponse.json(data as Habit);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Habit deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}