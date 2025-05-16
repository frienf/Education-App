import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Habit } from "@/lib/types/habit";

type Props = {
  habit: Habit;
  onToggle: () => void;
};

export default function HabitItem({ habit, onToggle }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center p-4">
        <Checkbox
          checked={habit.completed}
          onCheckedChange={onToggle}
          className="mr-4"
        />
        <span className={habit.completed ? "line-through text-gray-500" : ""}>
          {habit.name}
        </span>
      </CardContent>
    </Card>
  );
}