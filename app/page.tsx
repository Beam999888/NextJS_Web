'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  // 1. กำหนดรายการเมนูทั้งหมดไว้ใน Array เพื่อให้จัดการง่าย
  const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'PRODUCTS', href: '/product' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PROFILE', href: '/profile' },
    { label: 'CONTACT', href: '/contact' },
  ];

  // 2. สร้าง State สำหรับเก็บหน้าปัจจุบัน (Default คือหน้าแรก)
  const [activePage, setActivePage] = useState(menuItems[0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // เช็ค Path ปัจจุบันเพื่ออัปเดตชื่อหน้าบนเมนู
    const currentPath = window.location.pathname;
    const currentMenu = menuItems.find(item => item.href === currentPath);
    if (currentMenu) setActivePage(currentMenu);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. กรองเอาเฉพาะหน้า "ที่ไม่ใช่หน้าปัจจุบัน" มาแสดงใน Dropdown
  const otherMenus = menuItems.filter(item => item.label !== activePage.label);

  return (
    <div className="min-h-screen relative bg-[#0f2027]">
      {/* 1. Full Screen Video Section (Top) */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Logo - Left Side */}
        <div className="fixed top-8 left-8 z-50">
          <div className="text-white text-2xl font-bold tracking-wider uppercase drop-shadow-lg">
            Anukun Boontha
          </div>
        </div>

        {/* Navigation Menu - แก้ไขเฉพาะจุดนี้ตามที่คุณต้องการ */}
        <div className="fixed top-8 right-8 z-50 flex flex-col items-end">
          <div className="relative group flex flex-col items-end">
            
            {/* Main Trigger: จะแสดงชื่อหน้าปัจจุบันเสมอ */}
            <div className="text-white text-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[var(--sage-green)] transition-colors drop-shadow-lg cursor-pointer">
              {activePage.label}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Content: รายการอื่นๆ ที่ไม่ใช่หน้าปัจจุบัน */}
            <div className="absolute top-full right-0 mt-4 flex flex-col gap-4 items-end opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
              {otherMenus.map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Video Element (ใช้ Code เดิมของคุณ) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://www.pexels.com/th-th/download/video/7710243/" type="video/mp4" />
        </video>

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Footer Section (ใช้ Code เดิมของคุณทั้งหมด) */}
      <footer 
        className="relative z-10 w-full text-white py-16 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0f2027]/85 z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            <div className="mb-6">
              <img
                src="/cyber-security-logo.png"
                alt="Cyber Security Logo"
                className="w-32 h-32 object-cover rounded-full border-4 border-white/20 shadow-2xl"
              />
            </div>

            <h3 className="text-3xl font-bold mb-6 uppercase tracking-[0.2em] drop-shadow-lg text-[#1a3a32]">
              Anukun Boontha
            </h3>

            <div className="mb-8 space-y-3 text-gray-100 max-w-xl">
              <p className="text-lg leading-relaxed">99/9 ม.10 ต.บ้านหนองอีกึ่ม อ.อีก๋อย จ.ตระบองเมียงเจย ประเทศขแม</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm font-light tracking-widest uppercase">
                <span className="flex items-center gap-2">Tel: 999-999-9999</span>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center gap-2">Email: accadabim@gmail.com</span>
              </div>
            </div>

            {/* Social Icons (ใช้ Code เดิมของคุณ) */}
            <div className="flex gap-6 mb-8">
              <a href="#" className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-1.09 2.79-1.13 5.96-.28 8.8.72 2.45 2.64 4.53 5.09 5.37v4.13c-4.32-1.07-7.7-4.14-9.39-8.15-1.54-3.66-1.29-7.94.63-11.44-.66.04-1.32.09-1.98.05v-4.04c2.28.32 4.14-1.07 4.54-3.32h3.31zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" /></svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-400 tracking-widest uppercase border-t border-white/10 pt-8 w-full">
              <p>&copy; 2025 Anukun Boontha - All Rights Reserved | Design by Beam</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}