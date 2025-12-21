'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#0f2027]">
      {/* 1. Full Screen Video Section (Top) */}
      <div className="relative h-screen w-full overflow-hidden">
        
        {/* Navigation & Logo */}
        <div className="fixed top-8 left-8 z-50">
          <div className="text-white text-2xl font-bold tracking-wider uppercase drop-shadow-lg">
            Anukun Boontha
          </div>
        </div>

        <div className="fixed top-8 right-8 z-50 flex flex-col items-end">
          <div className="relative group flex flex-col items-end">
            <a href="/" className="text-white text-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[var(--sage-green)] transition-colors drop-shadow-lg cursor-pointer">
              HOME
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div className="absolute top-full right-0 mt-4 flex flex-col gap-4 items-end opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
              <a href="/product" className="text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md">Products</a>
              <a href="#about" className="text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md">About</a>
              <a href="/profile" className="text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md">Profile</a>
              <a href="/contact" className="text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md">Contact</a>
            </div>
          </div>
        </div>

        {/* --- ส่วนแก้ไข: Video Background --- */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            {/* สำคัญ: ลิงก์ต้องเป็นไฟล์วิดีโอโดยตรง เช่น .mp4 */}
            <source 
              src="https://www.pexels.com/th-th/download/video/10755266/" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          {/* Overlay ปรับความเข้มของวิดีโอเพื่อให้ตัวหนังสืออ่านง่ายขึ้น */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Text (Optional: ถ้าต้องการใส่ข้อความกลางวิดีโอ) */}
        <div className="relative z-10 flex items-center justify-center h-full">
           <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter">
             Cyber Security
           </h1>
        </div>
      </div>

      {/* Footer Section (เหมือนเดิมที่คุณทำไว้) */}
      <footer 
        className="relative z-10 w-full text-white py-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-[#0f2027]/90 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#fbbf24] overflow-hidden shadow-2xl mx-auto bg-gray-800">
                <img src="/cyber-security-logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-6 uppercase tracking-[0.2em] text-[#fbbf24]">
              Anukun Boontha
            </h3>
            <div className="mb-8 space-y-3 text-gray-100 max-w-xl">
              <p className="text-lg">99/9 ม.10 ต.บ้านหนองอีกึ่ม อ.อีก๋อย จ.ตระบองเมียงเจย ประเทศขแม</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm tracking-widest uppercase">
                <span>Tel: 999-999-9999</span>
                <span className="hidden md:inline">|</span>
                <span>Email: accadabim@gmail.com</span>
              </div>
            </div>
            {/* Social Icons (คงเดิม) */}
            <div className="flex gap-6 mb-8">
                {/* ... (SVG Icons เหมือนโค้ดเดิมของคุณ) */}
            </div>
            <div className="text-xs text-gray-400 tracking-widest uppercase border-t border-white/10 pt-8 w-full">
              <p>&copy; 2025 Anukun Boontha - All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}