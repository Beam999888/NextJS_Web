'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
 

type LoginErrorCode = 'INVALID_CREDENTIALS' | 'GENERIC';

function getErrorCode(data: unknown): LoginErrorCode {
    if (!data || typeof data !== 'object') return 'GENERIC';
    const code = (data as { errorCode?: unknown }).errorCode;
    if (code === 'INVALID_CREDENTIALS') return 'INVALID_CREDENTIALS';
    return 'GENERIC';
}

function LoginInner() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = useMemo(() => {
        const raw = searchParams.get('redirect');
        if (!raw) return '/';
        if (raw.startsWith('/')) return raw;
        return '/';
    }, [searchParams]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [isStartingOAuth, setIsStartingOAuth] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const code = getErrorCode(data);
                setError(code === 'INVALID_CREDENTIALS' ? t.auth.invalidCredentials : t.auth.genericError);
                return;
            }

            router.replace(redirectTo);
            router.refresh();
        } catch {
            setError(t.auth.genericError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const beginProvider = async (provider: 'google' | 'facebook' | 'github') => {
        setError('');
        setIsStartingOAuth(true);
        try {
            const res = await fetch(`/api/auth/${provider}/start?redirect=${encodeURIComponent(redirectTo)}`);
            const data = (await res.json()) as { authorizationUrl?: string };
            if (typeof data.authorizationUrl === 'string') {
                window.location.href = data.authorizationUrl;
            } else {
                setError(t.auth.genericError);
            }
        } catch {
            setError(t.auth.genericError);
        } finally {
            setIsStartingOAuth(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px-150px)] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-10">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-['Tenor_Sans',serif] text-white tracking-tight">{t.auth.loginTitle}</h1>
                            {t.auth.loginSubtitle ? (
                                <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mt-2">{t.auth.loginSubtitle}</p>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">{t.auth.email}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                                placeholder={t.auth.emailPlaceholder}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">{t.auth.password}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 pr-12 text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                                    placeholder={t.auth.passwordPlaceholder}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white transition-colors p-2"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl px-5 py-4">
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-xl active:scale-[0.98] disabled:opacity-60"
                        >
                            {t.auth.login}
                        </button>
                    </form>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <button
                            type="button"
                            onClick={() => beginProvider('google')}
                            className="w-full bg-red-500 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
                            disabled={isStartingOAuth}
                        >
                            <img src="/brands/google.svg" alt="Google" className="w-5 h-5" />
                            <span>{t.auth.loginWithGoogle}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => beginProvider('facebook')}
                            className="w-full bg-[#1877F2] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
                            disabled={isStartingOAuth}
                        >
                            <img src="/brands/facebook.svg" alt="Facebook" className="w-5 h-5" />
                            <span>{t.auth.loginWithFacebook}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => beginProvider('github')}
                            className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
                            disabled={isStartingOAuth}
                        >
                            <img src="/brands/github.svg" alt="GitHub" className="w-5 h-5" />
                            <span>{t.auth.loginWithGitHub}</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-white/60 text-xs">
                        {t.auth.needAccount}{' '}
                        <Link href="/register" className="text-white underline underline-offset-4 hover:opacity-80">
                            {t.auth.register}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginInner />
        </Suspense>
    );
}
