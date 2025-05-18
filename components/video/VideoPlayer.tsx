"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState, useEffect } from "react";

export default function VideoPlayer() {
  const { 
    videoUrl, 
    addComment, 
    currentTime, 
    setCurrentTime, 
    fetchVideoData, 
    videoId, 
    error: storeError,
    comments 
  } = useVideoStore();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      fetchVideoData(videoId).finally(() => {
        setIsLoading(false);
      });
    }
  }, [videoId, fetchVideoData]);

  const handleAddComment = () => {
    if (comment.trim() && videoId) {
      const timestamp = videoUrl?.includes('youtube.com') 
        ? currentTime 
        : videoRef.current?.currentTime || 0;
      
      addComment({
        text: comment,
        timestamp: Math.floor(timestamp),
        video_id: videoId
      });
      setComment("");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isNaN(videoRef.current.currentTime)) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleError = () => {
    setError("Failed to load video. Please check the URL and try again.");
  };

  // Add YouTube iframe message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.youtube.com" && event.data.event === "onStateChange") {
        if (event.data.info && typeof event.data.info.currentTime === 'number') {
          setCurrentTime(Math.floor(event.data.info.currentTime));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setCurrentTime]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Video Player</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {storeError || error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-red-900/50 text-red-200 rounded-lg">
              {storeError || error}
            </div>
          ) : isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black text-gray-300 rounded-lg">
              Loading video...
            </div>
          ) : !videoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black text-gray-300 rounded-lg">
              No video available
            </div>
          ) : videoUrl.includes('youtube.com') ? (
            <iframe
              src={`${videoUrl}&enablejsapi=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
              className="absolute inset-0 w-full h-full"
          onTimeUpdate={handleTimeUpdate}
              onError={handleError}
              preload="metadata"
        />
          )}
        </div>
        <div className="w-full bg-black rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-2">
          <Input
              placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
              className="flex-1 bg-gray-900 text-gray-100 placeholder-gray-500 border-gray-800"
          />
            <Button 
              onClick={handleAddComment}
              className="whitespace-nowrap bg-gray-900 hover:bg-gray-800 text-gray-100 border-gray-800"
            >
              Add Comment
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-900 p-3 rounded-lg">
                <p className="text-sm text-gray-100">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.timestamp * 1000).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}