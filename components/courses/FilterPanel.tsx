"use client";

import { useCourseStore } from "@/lib/zustand/courseStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilterPanel() {
  const { topics, timeRanges, selectedTopic, selectedTime, setTopic, setTime } =
    useCourseStore();

  return (
    <Card className="w-full md:w-64">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Topic</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTopic === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setTopic("All")}
            >
              All
            </Button>
            {topics.map((topic) => (
              <Button
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                size="sm"
                onClick={() => setTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Estimated Time</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTime === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setTime("All")}
            >
              All
            </Button>
            {timeRanges.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}