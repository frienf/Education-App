import { Inter } from "next/font/google";
import { Navigation } from "./navigation";
import { cn } from "@/src/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-gradient-to-b from-background to-background/95 text-foreground antialiased"
      )}>
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}