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
    const newComment: Omit<Comment, "id"> & { videoId: string } = {
      text: body.text,
      timestamp: body.timestamp,
      video_id: body.videoId,
    };
    const { data, error } = await supabase
      .from("comments")
      .insert({ ...newComment, id: `${body.videoId}-${Date.now()}` })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data as Comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("comments")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json(data as Comment);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}