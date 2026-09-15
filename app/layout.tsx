import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fathom — AI Meeting Notetaker (Demo)",
  description:
    "Polished Fathom-inspired demo: cinematic dark UI, AI summaries, transcripts, action items, and highlight clips. Recording bot stubbed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans starfield`}
      >
        <div className="min-h-screen">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
