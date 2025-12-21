import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Anukun Bootha",
  description: "Immerse yourself in the breathtaking beauty of our planet. Discover stunning nature photography, wilderness journeys, and conservation stories from around the world.",
  keywords: ["nature", "photography", "wilderness", "conservation", "travel", "landscapes", "environment"],
  authors: [{ name: "Nature's Embrace" }],
  openGraph: {
    title: "Anukun Boontha",
    description: "Discover the serenity within. Explore Earth's most beautiful landscapes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
