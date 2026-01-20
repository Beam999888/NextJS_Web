'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type RegisterErrorCode = 'USER_EXISTS' | 'GENERIC';

function getErrorCode(data: unknown): RegisterErrorCode {
    if (!data || typeof data !== 'object') return 'GENERIC';
    const code = (data as { errorCode?: unknown }).errorCode;
    if (code === 'USER_EXISTS') return 'USER_EXISTS';
    return 'GENERIC';
}

function RegisterInner() {
    const { t, language, setLanguage } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = useMemo(() => {
        const raw = searchParams.get('redirect');
        if (!raw) return '/';
        if (raw.startsWith('/')) return raw;
        return '/';
    }, [searchParams]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t.auth.passwordMismatch);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const code = getErrorCode(data);
                setError(code === 'USER_EXISTS' ? t.auth.userExists : t.auth.genericError);
                return;
            }

            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!loginRes.ok) {
                router.replace('/login');
                router.refresh();
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

    return (
        <div className="min-h-[calc(100vh-80px-150px)] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-10">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-['Tenor_Sans',serif] text-white tracking-tight">{t.auth.registerTitle}</h1>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mt-2">{t.auth.registerSubtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setLanguage('th')}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${language === 'th' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'}`}
                            >
                                {t.auth.switchToThai}
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${language === 'en' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'}`}
                            >
                                {t.auth.switchToEnglish}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">{t.auth.name}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                                placeholder={t.auth.namePlaceholder}
                                required
                                autoComplete="name"
                            />
                        </div>

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
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">{t.auth.confirmPassword}</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                                placeholder={t.auth.confirmPasswordPlaceholder}
                                required
                                autoComplete="new-password"
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
                            {t.auth.register}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-white/60 text-xs">
                        {t.auth.haveAccount}{' '}
                        <Link href="/login" className="text-white underline underline-offset-4 hover:opacity-80">
                            {t.auth.login}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterInner />
        </Suspense>
    );
}
