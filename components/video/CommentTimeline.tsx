"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CommentTimeline() {
  const { comments, seekTo } = useVideoStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => seekTo(comment.timestamp)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium">
                {formatTime(comment.timestamp)}: {comment.text}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to format timestamp
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}