import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Habit } from "@/lib/types/habit";

export async function GET() {
  try {
    const { data, error } = await supabase.from("habits").select("*");
    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Habit[]);
  } catch (error) {
    console.error("Unexpected GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await request.json();
    
    // Validate request body
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newHabit: Omit<Habit, "id"> = {
      name: body.name,
      completed: body.completed || false,
    };

    console.log("Attempting to insert habit:", newHabit);
    
    const { data, error } = await supabase
      .from("habits")
      .insert(newHabit)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Successfully created habit:", data);
    return NextResponse.json(data as Habit, { status: 201 });
  } catch (error) {
    console.error("Unexpected POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("habits")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    return NextResponse.json(data as Habit);
  } catch (error) {
    console.error("Unexpected PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Habit deleted" });
  } catch (error) {
    console.error("Unexpected DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}