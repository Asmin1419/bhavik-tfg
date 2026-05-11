import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lethabo · TFG Financial Services",
  description:
    "Lethabo — the voice of TFG Financial Services. A conversational AI built for South African customers, available around the clock.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA">
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
