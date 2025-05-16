"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";

export default function VideoPlayer() {
  const { videoUrl, addComment, currentTime, setCurrentTime } = useVideoStore();
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleAddComment = () => {
    if (comment.trim()) {
      addComment({
        id: Date.now().toString(),
        text: comment,
        timestamp: currentTime,
      });
      setComment("");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Player</CardTitle>
      </CardHeader>
      <CardContent>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full rounded"
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Add a comment at current time"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
      </CardContent>
    </Card>
  );
}