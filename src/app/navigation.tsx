"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Book,
  Clock,
  CheckCircle,
  PenTool,
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  Brain,
} from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/", icon: Brain },
  { name: "Flashcards", href: "/flashcards", icon: Book },
  { name: "Spaced Repetition", href: "/spaced-repetition", icon: Clock },
  { name: "Courses", href: "/courses", icon: GraduationCap },
  { name: "Habits", href: "/habits", icon: CheckCircle },
  { name: "Reading", href: "/reading", icon: BookOpen },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Video", href: "/video", icon: Video },
  { name: "Lessons", href: "/lessons", icon: PenTool },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2",
                    pathname === item.href && "bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline-block">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 