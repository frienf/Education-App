import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/types/course";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <Badge>{course.topic}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{course.estimatedTime} hours</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}