import { useSpacedRepetitionStore } from "@/lib/zustand/spacedRepetitionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsDashboard() {
  const { cards, cardsDue } = useSpacedRepetitionStore();

  const totalReviews = cards.reduce((sum, card) => sum + card.reviews, 0);
  const totalCorrect = cards.reduce((sum, card) => sum + card.correctReviews, 0);
  const accuracy = totalReviews > 0 ? ((totalCorrect / totalReviews) * 100).toFixed(2) : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Review Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">Total Cards</p>
            <p>{cards.length}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Cards Due</p>
            <p>{cardsDue.length}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Total Reviews</p>
            <p>{totalReviews}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Accuracy</p>
            <p>{accuracy}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}