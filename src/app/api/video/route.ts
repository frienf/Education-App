import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { Comment } from "@/lib/types/video";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  
  if (videoId) {
    const { data: comments, error: commentError } = await supabase
      .from("comments")
      .select("*")
      .eq("video_id", videoId);
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("*")
      .eq("id", videoId)
      .single();
    if (commentError || videoError) {
      return NextResponse.json(
        { error: commentError?.message || videoError?.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ comments: comments as Comment[], video });
  }

  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select("*");
  const { data: videos, error: videoError } = await supabase
    .from("videos")
    .select("*");
  if (commentError || videoError) {
    return NextResponse.json(
      { error: commentError?.message || videoError?.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ comments: comments as Comment[], videos });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", body.videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const newComment: Omit<Comment, "id"> = {
      text: body.text,
      timestamp: body.timestamp,
      video_id: body.videoId,
    };

    const { data, error } = await supabase
      .from("comments")
      .insert(newComment)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
    return NextResponse.json({
      id: data.id,
      text: data.text || "",
      timestamp: data.timestamp || 0,
      video_id: data.video_id
    } as Comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("videos")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Video deleted" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}