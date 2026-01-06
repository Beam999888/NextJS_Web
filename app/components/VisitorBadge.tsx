'use client';

import { useEffect, useState } from 'react';

type VisitorStats = { totalViews: number; onlineCount: number };

export default function VisitorBadge({ variant }: { variant: 'online' | 'total' }) {
    const [stats, setStats] = useState<VisitorStats | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/visitors', { cache: 'no-store' });
                if (!res.ok) return;
                const data = (await res.json()) as { totalViews?: number; onlineCount?: number };
                if (cancelled) return;
                const nextStats: VisitorStats = {
                    totalViews: typeof data.totalViews === 'number' ? data.totalViews : 0,
                    onlineCount: typeof data.onlineCount === 'number' ? data.onlineCount : 0,
                };
                setStats(nextStats);
            } catch {
            }
        };

        fetchStats();
        const intervalId = window.setInterval(fetchStats, 2000);
        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, []);

    if (!stats) return null;

    if (variant === 'total') {
        return (
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M12 5c6.5 0 10 7 10 7s-3.5 7-10 7S2 12 2 12s3.5-7 10-7Zm0 2C7.1 7 4.1 11 4.1 12S7.1 17 12 17s7.9-4 7.9-5-3-5-7.9-5Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                        fill="currentColor"
                    />
                </svg>
                <span>{stats.totalViews}</span>
            </div>
        );
    }

    return (
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M12 12c2.7614 0 5-2.2386 5-5S14.7614 2 12 2 7 4.2386 7 7s2.2386 5 5 5Zm0 2c-4.4183 0-8 3.5817-8 8h2c0-3.3137 2.6863-6 6-6s6 2.6863 6 6h2c0-4.4183-3.5817-8-8-8Z"
                    fill="currentColor"
                />
            </svg>
            <span>{stats.onlineCount}</span>
        </div>
    );
}
