'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    const [contact, setContact] = useState<any>(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/contact');
                const data = await res.json();
                setContact(data);
            } catch (error) {
                console.error('Failed to fetch contact data for footer', error);
            }
        };
        fetchContact();
    }, []);

    const socialLinks = [
        { name: 'TikTok', url: contact?.socials?.tiktok || 'https://www.tiktok.com/@beam999888' },
        { name: 'Facebook', url: contact?.socials?.facebook || 'https://www.facebook.com/share/19usVBmD2c/' },
        { name: 'Instagram', url: contact?.socials?.instagram || 'https://www.instagram.com/o_o.beam.000' },
        { name: 'GitHub', url: contact?.socials?.github || 'https://github.com/Beam999888' },
        { name: 'LinkedIn', url: contact?.socials?.linkedin || 'https://www.linkedin.com/in/anukun-boontha-003aa0334/' },
    ];

    if (!contact) return null;

    return (
        <footer className="relative w-full py-20 px-6 border-t border-gray-200 font-['Prompt',sans-serif] overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={contact.footerBg || "/footer-bg.jpg"}
                    alt="Footer Background"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Top Logo */}
                <div className="flex justify-center mb-16">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                        <img
                            src={contact.footerLogo || "/footer-logo.png"}
                            alt="Logo"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-4 text-black">
                    {/* Left Side */}
                    <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                        <h2 className="text-2xl md:text-3xl font-['Tenor_Sans',serif] uppercase tracking-wider text-black">
                            Anukun Boontha
                        </h2>
                        <p className="text-sm md:text-base text-black font-light uppercase tracking-[0.15em]">
                            {t.footer.role}
                        </p>
                        <p className="text-sm md:text-base text-black font-light uppercase tracking-[0.15em]">
                            {contact.university || t.contact.universityVal}
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6 text-center md:text-right w-full md:w-auto">
                        <div>
                            <a href={`mailto:${contact.email}`} className="text-lg md:text-xl font-medium text-black hover:text-black transition-colors">
                                {contact.email}
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs font-bold uppercase tracking-[0.2em] text-black">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-black transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-20 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-black uppercase tracking-widest gap-4">
                    <span>© 2025 All Rights Reserved.</span>
                    <span>Designed by Anukun</span>
                </div>
            </div>
        </footer>
    );
}
