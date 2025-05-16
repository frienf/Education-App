import { create } from "zustand";
import { Comment } from "@/lib/types/video";

type VideoState = {
  videoId: string | null;
  videoUrl: string;
  comments: Comment[];
  currentTime: number;
  fetchVideoData: (videoId: string) => Promise<void>;
  addComment: (comment: Omit<Comment, "id"> & { videoId: string }) => Promise<void>;
  updateComment: (id: string, updates: Partial<Comment>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  setVideoId: (id: string) => void;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
};

// Default video URL (replace with dynamic fetching in production)
const defaultVideoUrl = "/videos/sample-video.mp4";

export const useVideoStore = create<VideoState>((set) => ({
  videoId: null,
  videoUrl: defaultVideoUrl,
  comments: [],
  currentTime: 0,
  fetchVideoData: async (videoId) => {
    try {
      const response = await fetch(`/api/video?videoId=${videoId}`);
      const { comments, video } = await response.json();
      set({
        videoId,
        videoUrl: video?.url || defaultVideoUrl,
        comments,
      });
    } catch (error) {
      console.error("Failed to fetch video data:", error);
    }
  },
  addComment: async (comment) => {
    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      const newComment = await response.json();
      set((state) => ({ comments: [...state.comments, newComment] }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  },
  updateComment: async (id, updates) => {
    try {
      const response = await fetch("/api/video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const updatedComment = await response.json();
      set((state) => ({
        comments: state.comments.map((c) => (c.id === id ? updatedComment : c)),
      }));
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  },
  deleteComment: async (id) => {
    try {
      await fetch("/api/video", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      set((state) => ({ comments: state.comments.filter((c) => c.id !== id) }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  },
  setVideoId: (id) => set({ videoId: id }),
  setCurrentTime: (time) => set({ currentTime: time }),
  seekTo: (time) => {
    set({ currentTime: time });
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = time;
    }
  },
}));