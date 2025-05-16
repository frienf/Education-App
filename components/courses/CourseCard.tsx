import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/types/course";
import { motion } from "framer-motion";

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
          <div className="flex items-center justify-between">
            <Badge>{course.topic}</Badge>
            <span className="text-sm text-gray-500">
              {course.estimatedTime} hours
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{course.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}