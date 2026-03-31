import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyper Reality — A book unique to YOU",
  description: "The Mysterious Death of Alex Lambert 2",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
