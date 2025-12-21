'use client';

export default function Contact() {
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
                    <source src="https://www.pexels.com/th-th/download/video/7385122/" type="video/mp4" />
                </video>
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Navigation (Sticky & consistent with Home) */}
            <div className="fixed top-8 left-8 z-50">
                <a href="/" className="text-white text-2xl font-bold tracking-wider uppercase drop-shadow-lg hover:text-[var(--sage-green)] transition-colors">
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
                        <a href="/Product" className="!text-white text-lg font-semibold hover:text-[var(--sage-green)] transition-colors uppercase tracking-widest drop-shadow-md whitespace-nowrap">
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

            {/* Main Scrollable Content Area */}
            <div className="relative z-10 w-full pb-20 flex flex-col items-center" style={{ paddingTop: '420px' }}>

                {/* Section 1: Contact Us Header */}
                <div className="container mx-auto px-4 mb-24 text-center animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider uppercase drop-shadow-lg mb-6">
                        Contact Us
                    </h1>
                    <div className="w-24 h-1 bg-white mx-auto shadow-lg"></div>
                </div>

                {/* Section 2: Contact Info */}
                <div className="w-full flex flex-col items-center justify-center mb-32 animate-fade-in-up delay-100">
                    <p className="text-white text-lg md:text-xl mb-16 text-center max-w-3xl font-light px-4">
                        123 Siam Paragon, Rama I Road, Pathum Wan, Bangkok 10330
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 px-4">
                        {/* Instagram */}
                        <div className="flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbbf24] rounded-full flex items-center justify-center text-black text-3xl shadow-lg group-hover:bg-white transition-colors">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">Anukun Boontha</span>
                        </div>
                        {/* Facebook */}
                        <div className="flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbbf24] rounded-full flex items-center justify-center text-black text-3xl shadow-lg group-hover:bg-white transition-colors">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">Anukun Boontha</span>
                        </div>
                        {/* YouTube */}
                        <div className="flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbbf24] rounded-full flex items-center justify-center text-black text-3xl shadow-lg group-hover:bg-white transition-colors">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">Nature Channel</span>
                        </div>
                        {/* TikTok */}
                        <div className="flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbbf24] rounded-full flex items-center justify-center text-black text-3xl shadow-lg group-hover:bg-white transition-colors">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-1.09 2.79-1.13 5.96-.28 8.8.72 2.45 2.64 4.53 5.09 5.37v4.13c-4.32-1.07-7.7-4.14-9.39-8.15-1.54-3.66-1.29-7.94.63-11.44-.66.04-1.32.09-1.98.05v-4.04c2.28.32 4.14-1.07 4.54-3.32h3.31zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" /></svg>
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">@natureembrace</span>
                        </div>
                        {/* Line */}
                        <div className="flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbbf24] rounded-full flex items-center justify-center text-black text-3xl shadow-lg group-hover:bg-white transition-colors">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.88 2 10.66c0 4.27 3.55 7.84 8.21 8.52L10 22l3.41-1.9c3.96-.34 7.59-4.22 7.59-9.44C21 5.88 16.52 2 12 2z" /></svg>
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">@nature</span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Map */}
                <div className="w-full h-[450px] mb-20 relative shadow-2xl bg-black">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5525330366624!2d100.5323204758348!3d13.746187997453393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed483329037%3A0xc3f923b3648f86f8!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1710000000000"
                        className="w-full h-full filter grayscale contrast-125 opacity-90 hover:filter-none hover:opacity-100 transition-all duration-700"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                    ></iframe>
                </div>

                {/* Section 4: Contact Form */}
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-white pl-6 uppercase tracking-wider">
                        Send us a message
                    </h2>

                    <form className="space-y-6 bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2 ml-1">Name <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-transparent border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-colors" placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2 ml-1">Email <span className="text-red-500">*</span></label>
                                <input type="email" className="w-full bg-transparent border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-colors" placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2 ml-1">Phone <span className="text-red-500">*</span></label>
                                <input type="tel" className="w-full bg-transparent border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-colors" placeholder="Phone Number" />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2 ml-1">Company</label>
                                <input type="text" className="w-full bg-transparent border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-colors" placeholder="Company Name" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2 ml-1">Contact Type <span className="text-red-500">*</span></label>
                            <select className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#fbbf24] transition-colors appearance-none">
                                <option>General Inquiry</option>
                                <option>Course Booking</option>
                                <option>Partnership</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2 ml-1">Message <span className="text-red-500">*</span></label>
                            <textarea className="w-full bg-transparent border-2 border-white/20 rounded-xl px-4 py-3 text-white h-32 focus:outline-none focus:border-[#fbbf24] transition-colors" placeholder="Your Message..."></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="button" className="bg-[#fbbf24] hover:bg-white hover:text-[#fbbf24] text-black font-bold py-4 px-12 rounded-xl transition-all duration-300 shadow-lg uppercase tracking-wider text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 🖼️ Footer Section: แก้ไขตรงนี้เพื่อเปลี่ยนพื้นหลังเป็นรูปภาพ */}
            <footer 
                className="relative z-10 w-full py-16 bg-cover bg-center"
                style={{ 
                    // เปลี่ยน URL รูปภาพตรงนี้ (ส่วนพื้นที่ด้านนอกทั้งหมด)
                    backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070")' 
                }}
            >
                {/* Overlay สำหรับ Footer หลัก (เพื่อให้ตัวอักษรอ่านง่ายขึ้น) */}
                <div className="absolute inset-0 bg-black/70 z-0"></div>

                <div className="container relative z-10 mx-auto px-4 flex justify-center">
                    <div 
                        className="rounded-3xl p-10 max-w-2xl w-full flex flex-col items-center text-center shadow-2xl border border-white/10 bg-cover bg-center overflow-hidden"
                        
                    >
                        {/* Overlay สำหรับกล่องด้านใน */}
                        <div className="absolute inset-0 bg-[#2d5f6f]/80 z-0"></div>

                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="mb-6 flex justify-center">
                                <img
                                    src="/cyber-security-logo.png"
                                    alt="Cyber Security Logo"
                                    className="w-32 h-32 object-cover rounded-full border-4 border-[#fbbf24] shadow-xl"
                                />
                            </div>

                            {/* Brand Name */}
                            <h3 className="text-3xl font-black mb-6 uppercase tracking-widest text-white drop-shadow-md">
                                Anukun Boontha
                            </h3>

                            {/* Address & Contact */}
                            <div className="mb-8 space-y-3 text-gray-100 font-medium leading-relaxed">
                                <p className="text-sm md:text-base px-4">99/9 ม.10 ต.บ้านหนองอีกึ่ม อ.อีก๋อย จ.ตระบองเมียงเจย ประเทศขแม</p>
                                <p className="text-lg">Tel : <span className="text-[#fbbf24]">999-999-9999</span></p>
                                <p className="text-lg tracking-wide font-light">Email : accadabim@gmail.com</p>
                            </div>

                            {/* Social Icons */}
                            <div className="flex gap-5 mb-8 justify-center">
                                {[
                                    { icon: "facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" },
                                    { icon: "instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                ].map((item, idx) => (
                                    <a key={idx} href="#" className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={item.path} /></svg>
                                    </a>
                                ))}
                            </div>

                            {/* Copyright */}
                            <div className="text-xs text-gray-300 font-light border-t border-white/20 pt-6 w-full uppercase tracking-tighter">
                                <p>© Copyright by Beam 2025. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}