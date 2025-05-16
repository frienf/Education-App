import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  score: number;
  total: number;
};

export default function QuizResults({ score, total }: Props) {
  const percentage = ((score / total) * 100).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Score</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          You scored {score} out of {total} ({percentage}%)
        </p>
        {score === total && <p className="text-green-600 mt-2">Perfect score!</p>}
        {score < total / 2 && <p className="text-red-600 mt-2">Keep practicing!</p>}
      </CardContent>
    </Card>
  );
}