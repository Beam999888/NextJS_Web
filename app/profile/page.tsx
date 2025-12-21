'use client';

import Image from "next/image";

export default function Profile() {
    return (
        <div className="min-h-screen relative text-white">

            {/* 🎥 Background Video */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://www.pexels.com/th-th/download/video/5680034/" type="video/mp4" />
                </video>
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Navigation (Sticky & consistent with Home) */}
            <div className="fixed top-8 left-8 z-50">
                <a href="/" className="!text-white text-2xl font-bold tracking-wider uppercase drop-shadow-lg hover:text-[var(--sage-green)] transition-colors">
                    Anukun Boontha
                </a>
            </div>

            {/* Navigation Menu - Top Right Dropdown */}
            <div className="fixed top-8 right-8 z-50 flex flex-col items-end">
                <div className="relative group flex flex-col items-end">
                    {/* Main Trigger: HOME */}
                    <a href="/" className="!text-white text-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[var(--sage-green)] transition-colors drop-shadow-lg cursor-pointer">
                        HOME
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                    {/* Dropdown Content */}
                    <div className="absolute top-full right-0 mt-4 flex flex-col gap-4 items-end opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
                        <a href="/product" className="!text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                            Products
                        </a>
                        <a href="/#about" className="!text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                            About
                        </a>
                        <a href="/profile" className="!text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                            Profile
                        </a>
                        <a href="/contact" className="!text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                            Contact
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Centered Flex Container */}
            <div className="relative z-10 w-full flex flex-col items-center pb-20" style={{ paddingTop: '420px' }}>

                {/* Content Wrapper - Constrained Width & Centered */}
                <div className="w-full max-w-6xl px-4 flex flex-col md:flex-row gap-8 items-start justify-center animate-fade-in-up">

                    {/* Left Column: User Info (Centered Text) */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6 items-center text-center">
                        {/* Profile Image */}
                        <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
                            <img
                                src="/hero-mountain.png"
                                alt="Anukun Boontha"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-[#2d333b] p-2 rounded-full border border-white/10 text-white cursor-pointer hover:bg-white/10 transition">
                                <span className="text-xl">☺</span>
                            </div>
                        </div>

                        {/* Name & Bio */}
                        <div className="w-full">
                            <h1 className="text-3xl font-bold !text-white">Anukun Boontha</h1>
                            <p className="text-xl text-[#8b949e] font-light">Beam999888 · he/him</p>

                            <div className="mt-4 !text-white">
                                <p>👋 สวัสดีครับ ผมเป็นนักศึกษาจากสาขาความมั่นคงปลอดภัยไซเบอร์ (Cyber Security) คณะ วิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัย สวนดุสิต (SDU)</p>
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="text-[#8b949e] text-sm space-y-2 flex flex-col items-center w-full">
                            <div className="flex items-center gap-2 justify-center">
                                <span>🏢</span>
                                <span>Suan Dusit University</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <span>📍</span>
                                <span>Bankkok,Thailand</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <span>🕒</span>
                                <span>09:30 (UTC +07:00)</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <span>✉</span>
                                <a href="mailto:anukun25499@gmail.com" className="hover:text-[#58a6ff]">anukun25499@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-2 justify-center overflow-hidden text-ellipsis max-w-full">
                                <span>🔗</span>
                                <a href="https://www.tiktok.com/@beam999888" className="hover:text-[#58a6ff] truncate">https://www.tiktok.com/@beam999888</a>
                            </div>
                            <div className="flex items-center gap-2 justify-center overflow-hidden text-ellipsis max-w-full">
                                <span>🔗</span>
                                <a href="https://www.facebook.com/share" className="hover:text-[#58a6ff] truncate">https://www.facebook.com/share</a>
                            </div>
                            <div className="flex items-center gap-2 justify-center overflow-hidden text-ellipsis max-w-full">
                                <span>🔗</span>
                                <a href="https://www.instagram.com" className="hover:text-[#58a6ff] truncate">https://www.instagram.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: README.md Content */}
                    <div className="w-full md:w-2/3 bg-[#0d1117] border border-[#30363d] rounded-md p-8 shadow-xl">
                        <div className="prose prose-invert max-w-none !text-white">
                            <h2 className="text-2xl font-bold border-b border-[#30363d] pb-2 mb-4 !text-white">👋 Hello!</h2>
                            <p className="!text-white mb-4">
                                <strong>I'm Anukun Boontha</strong><br />
                                You can call me Daniel<br />
                                I'm 19 years old
                            </p>
                            <h3 className="text-xl font-bold mt-8 mb-4 !text-white">🌱 Education</h3>
                            <div className="bg-[#161b22] p-4 rounded-md !text-white">
                                <p>Cyber Security Program</p>
                                <p>Faculty of Science and Technology</p>
                                <p>Suan Dusit University</p>
                            </div>
                            <h3 className="text-xl font-bold mt-8 mb-4 !text-white">🔭 What I'm Learning</h3>
                            <ul className="list-disc list-inside !text-white space-y-1">
                                <li>Website system maintenance</li>
                                <li>3D game development</li>
                            </ul>
                            <h3 className="text-xl font-bold mt-8 mb-4 !text-white">📫 How to reach me</h3>
                            <ul className="list-disc list-inside !text-white space-y-1">
                                <li>Instagram: <span className="text-[#58a6ff]">@o_o.beam.000</span></li>
                                <li>Facebook: <span className="text-[#58a6ff]">Beam Anukun</span></li>
                                <li>Tiktok: <span className="text-[#58a6ff]">@beam999888</span></li>
                            </ul>
                            <h3 className="text-xl font-bold mt-8 mb-4 !text-white">😄 Pronouns</h3>
                            <p className="!text-white">He/Him</p>
                            <h3 className="text-xl font-bold mt-8 mb-4 !text-white">🚀 Some Tools I Have Used and Learned</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#007acc] text-white text-xs px-2 py-1 rounded font-mono">VS Code</span>
                                <span className="bg-[#777bb4] text-white text-xs px-2 py-1 rounded font-mono">PHP</span>
                                <span className="bg-[#3776ab] text-white text-xs px-2 py-1 rounded font-mono">Python</span>
                                <span className="bg-[#000000] text-white border border-white/20 text-xs px-2 py-1 rounded font-mono">Unity</span>
                                <span className="bg-[#31a8ff] text-white text-xs px-2 py-1 rounded font-mono">Ps</span>
                                <span className="bg-[#00c4cc] text-white text-xs px-2 py-1 rounded font-mono">Canva</span>
                                <span className="bg-[#e34f26] text-white text-xs px-2 py-1 rounded font-mono">HTML5</span>
                                <span className="bg-[#1572b6] text-white text-xs px-2 py-1 rounded font-mono">CSS3</span>
                                <span className="bg-[#f7df1e] text-black text-xs px-2 py-1 rounded font-mono">JS</span>
                                <span className="bg-[#478cbf] text-white text-xs px-2 py-1 rounded font-mono">Godot</span>
                                <span className="bg-[#f5792a] text-white text-xs px-2 py-1 rounded font-mono">Blender</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer 
                className="relative z-10 w-full text-white py-12 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')" }}
            >
                {/* เพิ่ม Overlay สีดำจางๆ ให้ Footer เพื่อให้ตัวหนังสืออ่านง่ายขึ้นแม้ไม่มีพื้นหลังสีฟ้า */}
                <div className="absolute inset-0 bg-black/40 -z-10" />

                <div className="container mx-auto px-4 flex justify-center">
                    {/* ลบ bg-[#2d5f6f] ออก และเพิ่ม backdrop-blur เพื่อความสวยงาม */}
                    <div className="rounded-lg p-8 max-w-2xl w-full flex flex-col items-center text-center">

                        {/* Logo */}
                        <div className="mb-6">
                            <img
                                src="/cyber-security-logo.png"
                                alt="Cyber Security Logo"
                                className="w-32 h-32 object-cover rounded-full border-2 border-white/20 shadow-lg"
                            />
                        </div>

                        {/* Brand Name */}
                        <h3 className="text-2xl font-bold mb-6 uppercase tracking-wider drop-shadow-md">
                            Anukun Boontha
                        </h3>

                        {/* Address & Contact */}
                        <div className="mb-6 space-y-2 text-white">
                            <p className="drop-shadow-sm">99/9 ม.10 ต.บ้านหนองอีกึ่ม อ.อีก๋อย จ.ตระบองเมียงเจย ประเทศขแม</p>
                            <p className="drop-shadow-sm">Tel : 999-999-9999</p>
                            <p className="drop-shadow-sm">Email : accadabim@gmail.com</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white transition-all duration-300 shadow-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white transition-all duration-300 shadow-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white transition-all duration-300 shadow-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white transition-all duration-300 shadow-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-1.09 2.79-1.13 5.96-.28 8.8.72 2.45 2.64 4.53 5.09 5.37v4.13c-4.32-1.07-7.7-4.14-9.39-8.15-1.54-3.66-1.29-7.94.63-11.44-.66.04-1.32.09-1.98.05v-4.04c2.28.32 4.14-1.07 4.54-3.32h3.31zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" /></svg>
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="text-sm text-gray-300 drop-shadow-sm">
                            <p>Copyright by Beam 2025</p>
                        </div>

                    </div>
                </div>
            </footer>
        </div>
    );
}