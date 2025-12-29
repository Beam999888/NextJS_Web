'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t, textColor, setTextColor } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hasLoginError, setHasLoginError] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            try {
                setIsAuthenticated(sessionStorage.getItem('admin_authenticated') === 'true');
            } catch {
                setIsAuthenticated(false);
            }
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'Beam1234' && password === 'Beam1234') {
            sessionStorage.setItem('admin_authenticated', 'true');
            setIsAuthenticated(true);
            setHasLoginError(false);
        } else {
            setHasLoginError(true);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
        router.push('/admin');
    };

    if (!isAuthenticated) {
        return (
            <div className="no-text-bg min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>

                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-['Tenor_Sans',serif] text-white mb-2 tracking-tight">{t.admin?.login?.title ?? 'Admin Portal'}</h1>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">{t.admin?.login?.subtitle ?? 'Secure Access Only'}</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{t.admin?.login?.username ?? 'Username'}</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                                    placeholder={t.admin?.login?.usernamePlaceholder ?? 'Enter username'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{t.admin?.login?.password ?? 'Password'}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                                        placeholder={t.admin?.login?.passwordPlaceholder ?? 'Enter password'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {hasLoginError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
                                    {t.admin?.login?.invalid ?? 'Invalid username or password'}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-xl active:scale-[0.98]"
                            >
                                {t.admin?.login?.authorize ?? 'Authorize Access'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="no-text-bg relative min-h-screen admin-theme"
            style={{ ['--admin-text-color' as never]: textColor }}
        >
            <button
                onClick={() => setIsThemeOpen((v) => !v)}
                className="fixed bottom-10 left-10 z-[60] flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.admin?.theme?.textColor ?? 'Text Color'}
            </button>

            {isThemeOpen && (
                <div className="fixed bottom-28 left-10 z-[60] w-[260px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                            {t.admin?.theme?.textColor ?? 'Text Color'}
                        </div>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="h-8 w-12 rounded cursor-pointer bg-transparent"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setTextColor('#000000')}
                        className="mt-3 w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all"
                    >
                        {t.admin?.theme?.reset ?? 'Reset'}
                    </button>
                </div>
            )}

            <button
                onClick={handleLogout}
                className="fixed bottom-10 right-10 z-[60] flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all shadow-2xl hover:scale-105 active:scale-95 group"
            >
                <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t.admin?.common?.logout ?? 'Logout'}
            </button>
            {children}
        </div>
    );
}
