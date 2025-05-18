export type Flashcard = {
    id: string;
    front: string;
    back: string;
    interval: number;
    ease: number;
    nextReview: string;
    reviews: number;
    correctReviews: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };