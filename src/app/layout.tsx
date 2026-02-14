import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYPER REALITY — a cockroach vs. a king?",
  description: "A philosophy book where everyone gets a different version. Roll your fate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen noise">{children}</body>
    </html>
  );
}
