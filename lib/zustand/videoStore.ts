import { create } from "zustand";
import { Comment } from "@/lib/types/video";

type VideoState = {
  videoId: string | null;
  videoUrl: string;
  comments: Comment[];
  currentTime: number;
  setVideoId: (id: string) => void;
  addComment: (comment: Comment) => void;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
};

// Sample video URL (replace with dynamic fetching in production)
const defaultVideoUrl = "/videos/sample-video.mp4";

export const useVideoStore = create<VideoState>((set) => ({
  videoId: null,
  videoUrl: defaultVideoUrl,
  comments: [
    {
      id: "1",
      text: "Great introduction!",
      timestamp: 10,
    },
    {
      id: "2",
      text: "Interesting point here.",
      timestamp: 45,
    },
  ],
  currentTime: 0,
  setVideoId: (id) =>
    set({
      videoId: id,
      videoUrl: `/videos/video-${id}.mp4`, // Adjust based on actual video storage
    }),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  setCurrentTime: (time) => set({ currentTime: time }),
  seekTo: (time) => {
    set({ currentTime: time });
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = time;
    }
  },
}));