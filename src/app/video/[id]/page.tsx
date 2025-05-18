"use client";

import { useVideoStore } from "@/lib/zustand/videoStore";
import VideoPlayer from "@/components/video/VideoPlayer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function VideoDetailPage({ params }: Props) {
  const { setVideoId, fetchVideoData } = useVideoStore();
  const [videoId, setVideoIdState] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setVideoIdState(resolvedParams.id);
      setVideoId(resolvedParams.id);
      fetchVideoData(resolvedParams.id);
    };
    loadData();
  }, [params, setVideoId, fetchVideoData]);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Video {videoId}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>
      </div>
    </motion.div>
  );
}