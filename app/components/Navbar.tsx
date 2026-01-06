'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const { t } = useLanguage();
    const visitorIdRef = useRef('');

    useEffect(() => {
        let visitorId = '';
        try {
            const existing = localStorage.getItem('visitor_id');
            if (existing && existing.length > 0) {
                visitorId = existing;
            } else {
                const nextId = typeof crypto?.randomUUID === 'function'
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                visitorId = nextId;
                localStorage.setItem('visitor_id', nextId);
            }
        } catch {
        }
        visitorIdRef.current = visitorId;
        try {
            const now = Date.now();
            const lastVisitAtRaw = localStorage.getItem('visitor_last_visit_at');
            const lastVisitAt = lastVisitAtRaw ? Number.parseInt(lastVisitAtRaw, 10) : NaN;
            const sessionTtlMs = 30 * 60 * 1000;
            const shouldCount = !Number.isFinite(lastVisitAt) || now - lastVisitAt > sessionTtlMs;
            if (shouldCount && visitorId) {
                fetch('/api/visitors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
                    body: JSON.stringify({ type: 'hit' }),
                }).catch(() => { });
                localStorage.setItem('visitor_last_visit_at', String(now));
            }
        } catch {
        }
    }, []);

    useEffect(() => {
        const ping = () => {
            fetch('/api/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorIdRef.current },
                body: JSON.stringify({ type: 'heartbeat' }),
            }).catch(() => { });
        };

        ping();
        const intervalId = window.setInterval(ping, 15000);
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') ping();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    const links = [
        { href: '/', label: t.nav.home },
        { href: '/profile', label: t.nav.profile },
        { href: '/product', label: t.nav.products },
        { href: '/contact', label: t.nav.contact },
    ];

    const adminLinks = [
        { href: '/admin/home', label: t.admin?.nav?.home ?? 'Home' },
        { href: '/admin/home/slider', label: t.admin?.nav?.background ?? 'Background' },
        { href: '/admin/profile', label: t.admin?.nav?.profile ?? 'Profile' },
        { href: '/admin', label: t.admin?.nav?.product ?? 'Product' },
        { href: '/admin/contact', label: t.admin?.nav?.contact ?? 'Contact' },
        { href: '/admin/footer', label: t.admin?.nav?.footer ?? 'Footer' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-transparent border-none">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">

                {/* Brand */}
                <Link href="/" className="text-xl font-['Tenor_Sans',serif] tracking-widest uppercase hover:opacity-70 transition-opacity text-white">
                    Anukun Boontha
                </Link>

                <div className="flex items-center gap-8">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 items-center">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:opacity-70 ${pathname === link.href ? 'text-white border-b border-white pb-1' : 'text-white'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Admin Dropdown Desktop */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsAdminOpen(true)}
                            onMouseLeave={() => setIsAdminOpen(false)}
                        >
                            <button
                                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:opacity-70 flex items-center gap-2 ${pathname.startsWith('/admin') ? 'text-white border-b border-white pb-1' : 'text-white'}`}
                            >
                                {t.nav.admin}
                                <svg className={`w-3 h-3 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            <div className={`absolute top-full right-0 mt-4 w-52 bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl transition-all duration-300 z-50 overflow-hidden ${isAdminOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                {adminLinks.map((sub, idx) => (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className={`block px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors ${idx !== adminLinks.length - 1 ? 'border-b border-black/5' : ''}`}
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Language Switcher (Desktop & Mobile - placed here to be always visible or just desktop? User said top right) */}
                    {/* Let's put it here so it's on the right */}
                    <div className="hidden md:block border-l pl-8 border-white/20">
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden">
                    <LanguageSwitcher />
                    <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
                        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 flex flex-col items-center py-8 gap-6 md:hidden animate-fade-in-down shadow-xl">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-sm font-bold uppercase tracking-[0.2em] ${pathname === link.href ? 'text-black' : 'text-black'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Admin Section Mobile */}
                        <div className="w-full flex flex-col items-center gap-4 mt-4 border-t border-black/5 pt-8">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-2">{t.nav.admin}</span>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6 text-center">
                                {adminLinks.map((sub) => (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-[10px] font-bold uppercase tracking-widest ${pathname === sub.href ? 'text-black border-b border-black pb-1' : 'text-black/60'}`}
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
