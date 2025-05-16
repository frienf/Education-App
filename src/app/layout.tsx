import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="p-4 bg-gray-800 text-white">
          <ul className="flex space-x-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/flashcards">Flashcards</Link></li>
            <li><Link href="/quiz">Quiz</Link></li>
            <li><Link href="/habits">Habits</Link></li>
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/reading">Reading</Link></li>
            <li><Link href="/notes">Notes</Link></li>
            <li><Link href="/video">Video</Link></li>
            <li><Link href="/lessons">Lessons</Link></li>
            <li><Link href="/spaced-repetition">Spaced Repetition</Link></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}