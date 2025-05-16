"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import VideoPlayer from "@/components/video/VideoPlayer";
import CommentTimeline from "@/components/video/CommentTimeline";
import { motion } from "framer-motion";

type Props = {
  params: { id: string };
};

export default function VideoDetailPage({ params }: Props) {
  const { setVideoId, videoUrl } = useVideoStore();
  setVideoId(params.id);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Video {params.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>
        <div>
          <CommentTimeline />
        </div>
      </div>
    </motion.div>
  );
}