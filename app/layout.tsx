import type { Metadata, Viewport } from "next";
import fs from "fs";
import path from "path";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Anukun Boontha - Portfolio",
  description: "Cyber Security Student & Minimalist Portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type BackgroundType = "video" | "image";

function getBackground() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "home.json");
    if (!fs.existsSync(dataFilePath)) return { type: "image" as const, url: "/forest.png" };
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(fileData) as {
      background?: { type?: BackgroundType; url?: string };
    };

    const url = typeof parsed?.background?.url === "string" ? parsed.background.url : "";
    const type = parsed?.background?.type === "video" || parsed?.background?.type === "image" ? parsed.background.type : undefined;

    if (type === "video" && url) return { type: "video" as const, url };
    if (type === "image" && url) return { type: "image" as const, url };
    if (!type && url) return { type: "image" as const, url };

    return { type: "image" as const, url: "/forest.png" };
  } catch {
    return { type: "image" as const, url: "/forest.png" };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const background = getBackground();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased pt-20">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {background.type === "video" ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              src={background.url}
            />
          ) : (
            <img src={background.url} alt="" className="w-full h-full object-cover object-center" />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <LanguageProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-80px-150px)] relative z-10">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
