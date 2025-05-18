"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import VideoPlayer from "@/components/video/VideoPlayer";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function VideoPage() {
  const { fetchVideoData } = useVideoStore();

  useEffect(() => {
    fetchVideoData("default"); // Use a default video ID or fetch a list
  }, [fetchVideoData]);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Interactive Video Player</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>
      </div>
    </motion.div>
  );
}