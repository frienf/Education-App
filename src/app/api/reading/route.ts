import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Reading } from "@/lib/types/reading";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching readings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Reading[]);
  } catch (error) {
    console.error("Error in GET /api/reading:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received reading data:", body);

    const newReading = {
      title: body.title,
      author: body.author,
      date: body.date || new Date().toISOString().split("T")[0],
      rating: Number(body.rating),
    };

    console.log("Processed reading data:", newReading);

    const { data, error } = await supabase
      .from("readings")
      .insert(newReading)
      .select()
      .single();

    if (error) {
      console.error("Error inserting reading:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Successfully inserted reading:", data);
    return NextResponse.json(data as Reading, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/reading:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
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
      console.error("Error updating reading:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Reading entry not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(data as Reading);
  } catch (error) {
    console.error("Error in PUT /api/reading:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("readings").delete().eq("id", id);

    if (error) {
      console.error("Error deleting reading:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Reading entry deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/reading:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}