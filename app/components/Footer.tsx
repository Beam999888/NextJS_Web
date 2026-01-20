'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from "../context/LanguageContext";

interface ContactData {
    email?: string;
    university?: string;
    footerLogo?: string;
    footerBg?: string;
    footerOverlayOpacity?: number | string;
    footerName?: string;
    footerRole?: string;
    footerRights?: string;
    footerDesignedBy?: string;
    socials?: {
        tiktok?: string;
        facebook?: string;
        instagram?: string;
        github?: string;
        linkedin?: string;
    };
}

export default function Footer() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [contact, setContact] = useState<ContactData | null>(null);

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        if (isAuthPage) return;
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/contact');
                const data = (await res.json()) as ContactData;
                setContact(data);
            } catch (error) {
                console.error('Failed to fetch contact data for footer', error);
            }
        };
        fetchContact();
    }, [isAuthPage]);

    const defaultFooterBg = '/forest.png';
    const defaultFooterLogo = '/logo.png';
    const overlayOpacityRaw = contact?.footerOverlayOpacity;
    const overlayOpacityNumber =
        typeof overlayOpacityRaw === 'number'
            ? overlayOpacityRaw
            : typeof overlayOpacityRaw === 'string'
                ? Number.parseInt(overlayOpacityRaw, 10)
                : NaN;
    const overlayOpacityPercent = Number.isFinite(overlayOpacityNumber) ? Math.max(0, Math.min(100, overlayOpacityNumber)) : 20;

    const socialLinks = [
        { name: 'TikTok', url: contact?.socials?.tiktok },
        { name: 'Facebook', url: contact?.socials?.facebook },
        { name: 'Instagram', url: contact?.socials?.instagram },
        { name: 'GitHub', url: contact?.socials?.github },
        { name: 'LinkedIn', url: contact?.socials?.linkedin },
    ].filter((l): l is { name: string; url: string } => typeof l.url === 'string' && l.url.length > 0);

    if (!contact) return null;

    const textBoxClassName = "inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-white/20";
    const textBoxSmallClassName = "inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-white/20";

    return isAuthPage ? null : (
        <footer className="relative w-full py-12 md:py-14 px-6 border-t border-gray-200 font-['Prompt',sans-serif] overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 bg-gray-100">
                <img
                    src={contact.footerBg || defaultFooterBg}
                    alt="Footer Background"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        const img = e.currentTarget;
                        if (img.getAttribute('src') === defaultFooterBg) {
                            img.style.display = 'none';
                            return;
                        }
                        img.src = defaultFooterBg;
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(255,255,255, ${overlayOpacityPercent / 100})` }}
                ></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Top Logo */}
                <div className="flex justify-center mb-10 md:mb-12">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                        <img
                            src={contact.footerLogo || defaultFooterLogo}
                            alt="Logo"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                const img = e.currentTarget;
                                if (img.getAttribute('src') === defaultFooterLogo) {
                                    img.style.display = 'none';
                                    return;
                                }
                                img.src = defaultFooterLogo;
                            }}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 text-black">
                    {/* Left Side */}
                    <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                        <h2 className={`text-xl md:text-2xl font-['Tenor_Sans',serif] uppercase tracking-wider text-black ${textBoxClassName}`}>
                            {contact.footerName || 'Anukun Boontha'}
                        </h2>
                        <p className={`text-xs md:text-sm text-black font-light uppercase tracking-[0.15em] ${textBoxSmallClassName}`}>
                            {contact.footerRole || t.footer.role}
                        </p>
                        <p className={`text-xs md:text-sm text-black font-light uppercase tracking-[0.15em] ${textBoxSmallClassName}`}>
                            {contact.university || t.contact.universityVal}
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6 text-center md:text-right w-full md:w-auto">
                        <div>
                            <a href={`mailto:${contact.email}`} className={`text-base md:text-lg font-medium text-black hover:text-black transition-colors ${textBoxClassName}`}>
                                {contact.email}
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-end gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`hover:text-black transition-colors relative group ${textBoxSmallClassName}`}
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-black/60 transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-black uppercase tracking-widest gap-4">
                    <span className={textBoxSmallClassName}>{contact.footerRights || '© 2025 All Rights Reserved.'}</span>
                    <span className={textBoxSmallClassName}>{contact.footerDesignedBy || 'Designed by Anukun'}</span>
                </div>
            </div>
        </footer>
    );
}
