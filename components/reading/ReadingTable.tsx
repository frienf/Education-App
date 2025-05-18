"use client";

import { useReadingStore } from "@/lib/zustand/readingStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StarRating from "@/components/reading/StarRating";
import { motion } from "framer-motion";
import { Reading } from "@/lib/types/reading";

type SortKey = keyof Reading;

export default function ReadingTable() {
  const { readings, sortReadings, sortKey, sortOrder } = useReadingStore();

  const handleSort = (key: SortKey) => {
    sortReadings(key);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
            Title {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("author")} className="cursor-pointer">
            Author {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
            Date {sortKey === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => handleSort("rating")} className="cursor-pointer">
            Rating {sortKey === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((reading) => (
          <motion.tr
            key={reading.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-border/40"
          >
            <TableCell>{reading.title}</TableCell>
            <TableCell>{reading.author}</TableCell>
            <TableCell>{reading.date}</TableCell>
            <TableCell>
              <StarRating rating={reading.rating} />
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}