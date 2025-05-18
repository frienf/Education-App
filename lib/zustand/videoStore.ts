import { create } from "zustand";
import { Comment } from "@/lib/types/video";

type VideoState = {
  videoId: string | null;
  videoUrl: string | null;
  comments: Comment[];
  currentTime: number;
  defaultVideoId: string;
  fetchVideoData: (videoId: string) => Promise<void>;
  addComment: (comment: Omit<Comment, "id">) => Promise<void>;
  updateComment: (id: string, updates: Partial<Comment>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  setVideoId: (id: string) => void;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
  error?: string;
};

// Default video ID from the database
const defaultVideoId = "550e8400-e29b-41d4-a716-446655440000";

export const useVideoStore = create<VideoState>((set) => ({
  videoId: defaultVideoId,
  videoUrl: null,
  comments: [],
  currentTime: 0,
  defaultVideoId,
  fetchVideoData: async (videoId) => {
    try {
      // If videoId is 'default', use the default video ID
      const actualVideoId = videoId === 'default' ? defaultVideoId : videoId;
      const response = await fetch(`/api/video?videoId=${actualVideoId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { comments, video } = await response.json();
      if (!video) {
        console.error("Video not found");
        return;
      }
      // Convert YouTube URL to embed URL
      let videoUrl = video.url;
      if (video.url.includes('youtube.com/shorts/')) {
        const videoId = video.url.split('/shorts/')[1];
        videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      } else if (video.url.includes('youtube.com/watch?v=')) {
        const videoId = video.url.split('v=')[1];
        videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      }
      set({
        videoId: actualVideoId,
        videoUrl,
        comments: comments || [],
      });
    } catch (error) {
      console.error("Failed to fetch video data:", error);
      // Set error state
      set((state) => ({
        ...state,
        videoUrl: null,
        error: "Failed to load video. Please try again."
      }));
    }
  },
  addComment: async (comment: Omit<Comment, "id">) => {
    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comment.text,
          timestamp: comment.timestamp,
          videoId: comment.video_id
        }),
      });
      const newComment = await response.json();
      set((state) => ({ comments: [...(state.comments || []), newComment] }));
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
    if (isNaN(time) || time < 0) return;
    set({ currentTime: Math.floor(time) });
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = Math.floor(time);
    }
  },
}));