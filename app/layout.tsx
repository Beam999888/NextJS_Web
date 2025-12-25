import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Anukun Boontha - Portfolio",
  description: "Cyber Security Student & Minimalist Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased pt-20">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            // เพิ่ม object-center เพื่อให้วิดีโออยู่ตรงกลางเสมอ
            className="w-full h-full object-cover object-center"
          >
            {/* แนะนำให้ใช้ไฟล์วิดีโอในเครื่อง หรือ Direct Link ที่มีความละเอียดสูง */}
            <source src="https://www.pexels.com/th-th/download/video/7710243/" type="video/mp4" />
          </video>

          {/* ปรับค่าความใส (Opacity) จาก 50 เป็น 20 หรือ 30 เพื่อให้วิดีโอชัดขึ้น */}
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
