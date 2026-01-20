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
    const [thaiIdQr, setThaiIdQr] = useState<{ authorizationUrl: string; qrUrl: string } | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);
    const [isStartingOAuth, setIsStartingOAuth] = useState(false);

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

    const beginThaiId = async () => {
        setError('');
        setIsCheckingAuth(true);
        try {
            const res = await fetch(`/api/auth/thaid/start?redirect=${encodeURIComponent(redirectTo)}`);
            const data = (await res.json()) as { authorizationUrl?: string; qrUrl?: string };
            if (typeof data.authorizationUrl === 'string' && typeof data.qrUrl === 'string') {
                setThaiIdQr({ authorizationUrl: data.authorizationUrl, qrUrl: data.qrUrl });
                const interval = window.setInterval(async () => {
                    try {
                        const me = await fetch('/api/auth/me');
                        const j = await me.json();
                        if (j && typeof j === 'object' && (j as { authenticated?: unknown }).authenticated === true) {
                            window.clearInterval(interval);
                            router.replace(redirectTo);
                            router.refresh();
                        }
                    } catch {
                    }
                }, 2000);
            } else {
                setError(t.auth.genericError);
            }
        } catch {
            setError(t.auth.genericError);
        } finally {
            setIsCheckingAuth(false);
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                                placeholder={t.auth.passwordPlaceholder}
                                required
                                autoComplete="current-password"
                            />
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

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={beginThaiId}
                            className="w-full bg-blue-500 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-60"
                            disabled={isCheckingAuth}
                        >
                            {t.auth.loginWithThaiID}
                        </button>
                        {thaiIdQr && (
                            <div className="mt-6 flex flex-col items-center gap-3">
                                <a
                                    href={thaiIdQr.authorizationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white underline underline-offset-4 text-xs"
                                >
                                    {t.auth.openThaiIDApp}
                                </a>
                                <span className="text-white/60 text-xs">{t.auth.orScanQRCode}</span>
                                <div className="bg-white p-4 rounded-2xl">
                                    <img src={thaiIdQr.qrUrl} alt="ThaiID QR" width={240} height={240} />
                                </div>
                            </div>
                        )}
                    </div>

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
