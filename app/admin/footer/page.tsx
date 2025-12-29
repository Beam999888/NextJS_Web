'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Socials = {
    tiktok: string;
    facebook: string;
    instagram: string;
    github: string;
    linkedin: string;
};

type ContactData = {
    title: string;
    intro: string;
    email: string;
    university: string;
    location: string;
    image: string;
    footerLogo: string;
    footerBg: string;
    footerOverlayOpacity: number;
    footerName: string;
    footerRole: string;
    footerRights: string;
    footerDesignedBy: string;
    leftText: string;
    rightText: string;
    socials: Socials;
};

const initialData: ContactData = {
    title: '',
    intro: '',
    email: '',
    university: '',
    location: '',
    image: '',
    footerLogo: '',
    footerBg: '',
    footerOverlayOpacity: 20,
    footerName: '',
    footerRole: '',
    footerRights: '',
    footerDesignedBy: '',
    leftText: '',
    rightText: '',
    socials: { tiktok: '', facebook: '', instagram: '', github: '', linkedin: '' }
};

export default function AdminFooterPage() {
    const [data, setData] = useState<ContactData>(initialData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const maxUploadBytes = 50 * 1024 * 1024;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/contact');
                if (!res.ok) return;
                const incoming = (await res.json()) as Partial<ContactData>;
                setData({
                    ...initialData,
                    ...incoming,
                    socials: { ...initialData.socials, ...(incoming.socials || {}) }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const validateImageFile = (file: File) => {
        if (file.size > maxUploadBytes) return 'File too large (max 50MB)';
        if (!file.type.startsWith('image/')) return 'Please select an image file';
        return null;
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message || 'Upload failed');
        return json.url as string;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const key = name.replace('social_', '') as keyof Socials;
            setData(prev => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
            return;
        }
        if (name === 'footerOverlayOpacity') {
            const parsed = Number.parseInt(value, 10);
            const safe = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 20;
            setData(prev => ({ ...prev, footerOverlayOpacity: safe }));
            return;
        }
        setData(prev => ({ ...prev, [name]: value } as ContactData));
    };

    const handleUploadField = async (field: 'footerLogo' | 'footerBg', file: File) => {
        const error = validateImageFile(file);
        if (error) {
            setMessage(error);
            return;
        }
        setSaving(true);
        setMessage('Uploading...');
        try {
            const url = await uploadImage(file);
            setData(prev => ({ ...prev, [field]: url } as ContactData));
            setMessage('Uploaded');
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('Saving...');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.error || 'Save failed');
            }
            setMessage('Saved');
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const defaultFooterBg = '/forest.png';
    const defaultFooterLogo = '/logo.png';
    const previewBg = data.footerBg || defaultFooterBg;
    const previewLogo = data.footerLogo || defaultFooterLogo;
    const overlayOpacity = Number.isFinite(data.footerOverlayOpacity) ? Math.max(0, Math.min(100, data.footerOverlayOpacity)) : 20;

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-5xl font-['Prompt',sans-serif]">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
                <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest border border-black/10 px-6 py-3 rounded-full hover:bg-gray-800 hover:text-white transition-all">
                    Back to Product Admin
                </Link>
            </div>

            <h1 className="text-3xl font-['Tenor_Sans',serif] mb-8">Manage Footer</h1>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">Images</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider">Footer Logo (Profile)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-black/10">
                                        <img src={previewLogo} alt="Footer Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={saving}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            void handleUploadField('footerLogo', file);
                                            e.target.value = '';
                                        }}
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider">Footer Background</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-14 rounded-xl overflow-hidden bg-gray-100 border border-black/10">
                                        <img src={previewBg} alt="Footer Background" className="w-full h-full object-cover" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={saving}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            void handleUploadField('footerBg', file);
                                            e.target.value = '';
                                        }}
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <label className="text-xs font-bold uppercase tracking-wider">Background Opacity</label>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">{overlayOpacity}%</div>
                            </div>
                            <input
                                name="footerOverlayOpacity"
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={overlayOpacity}
                                disabled={saving}
                                onChange={handleChange}
                                className="w-full"
                            />
                            <div className="text-[10px] text-black/50 uppercase tracking-widest">0 = ชัด, 100 = จาง</div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">Text</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Footer Name</label>
                                <input name="footerName" value={data.footerName} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="e.g., Anukun Boontha" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Footer Role</label>
                                <input name="footerRole" value={data.footerRole} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="Leave empty to use default language text" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">University</label>
                                    <input name="university" value={data.university} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Email</label>
                                    <input name="email" value={data.email} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Rights</label>
                                    <input name="footerRights" value={data.footerRights} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Designed By</label>
                                    <input name="footerDesignedBy" value={data.footerDesignedBy} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">Social Links</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">TikTok URL</label>
                                <input name="social_tiktok" value={data.socials.tiktok} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Facebook URL</label>
                                <input name="social_facebook" value={data.socials.facebook} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Instagram URL</label>
                                <input name="social_instagram" value={data.socials.instagram} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">GitHub URL</label>
                                <input name="social_github" value={data.socials.github} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">LinkedIn URL</label>
                                <input name="social_linkedin" value={data.socials.linkedin} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" />
                            </div>
                        </div>
                    </section>

                    <div className="space-y-4">
                        <button type="submit" disabled={saving} className="w-full bg-gray-200 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-300 transition-all disabled:opacity-50 shadow-xl border border-black/10">
                            {saving ? 'Saving...' : 'Save Footer'}
                        </button>
                        {message && (
                            <div className="p-4 rounded-2xl text-center text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                {message}
                            </div>
                        )}
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Preview</div>
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 shadow-xl">
                        <div className="absolute inset-0">
                            <img src={previewBg} alt="Preview Background" className="w-full h-full object-cover" />
                            <div
                                className="absolute inset-0 backdrop-blur-[1px]"
                                style={{ backgroundColor: `rgba(255,255,255, ${overlayOpacity / 100})` }}
                            ></div>
                        </div>
                        <div className="relative p-10">
                            <div className="flex justify-center mb-10">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-white">
                                    <img src={previewLogo} alt="Preview Logo" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-black">
                                <div className="space-y-2 w-full md:w-auto">
                                    <div className="text-2xl font-['Tenor_Sans',serif] uppercase tracking-wider">{data.footerName || '—'}</div>
                                    <div className="text-xs uppercase tracking-[0.15em] text-black/80">{data.footerRole || '—'}</div>
                                    <div className="text-xs uppercase tracking-[0.15em] text-black/80">{data.university || '—'}</div>
                                </div>
                                <div className="space-y-4 w-full md:w-auto md:text-right">
                                    <div className="text-sm font-medium">{data.email || '—'}</div>
                                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        {Object.entries(data.socials)
                                            .filter(([, url]) => typeof url === 'string' && url.length > 0)
                                            .map(([key]) => (
                                                <span key={key}>{key}</span>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest gap-3">
                                <span>{data.footerRights || '—'}</span>
                                <span>{data.footerDesignedBy || '—'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-black/50">
                        เปลี่ยนแล้วจะมีผลกับ Footer ทุกหน้าที่แสดง Footer
                    </div>
                </div>
            </div>
        </div>
    );
}
