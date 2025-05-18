import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Course } from "@/lib/types/course";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topic: z.string().min(1, "Topic is required"),
  estimatedTime: z.number().positive("Estimated time must be positive"),
  description: z.string().min(1, "Description is required"),
});

export async function GET() {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as Course[]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const newCourse: Omit<Course, "id"> = {
      title: parsed.data.title,
      topic: parsed.data.topic,
      estimatedTime: parsed.data.estimatedTime,
      description: parsed.data.description,
    };
    const { data, error } = await supabase
      .from("courses")
      .insert({ ...newCourse, id: crypto.randomUUID() })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Course, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("courses")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(data as Course);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Course deleted" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
