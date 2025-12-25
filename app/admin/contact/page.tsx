'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactData {
    title: string;
    intro: string;
    email: string;
    university: string;
    location: string;
    image: string;
    footerLogo: string;
    footerBg: string;
    leftText: string;
    rightText: string;
    socials: {
        facebook: string;
        instagram: string;
        tiktok: string;
    };
}

export default function AdminContactPage() {
    const [contact, setContact] = useState<ContactData>({
        title: '',
        intro: '',
        email: '',
        university: '',
        location: '',
        image: '',
        footerLogo: '',
        footerBg: '',
        leftText: '',
        rightText: '',
        socials: { facebook: '', instagram: '', tiktok: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/contact');
                const data = await res.json();
                setContact(data);
            } catch (error) {
                console.error('Failed to fetch contact data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialName = name.replace('social_', '');
            setContact(prev => ({
                ...prev,
                socials: { ...prev.socials, [socialName]: value }
            }));
        } else {
            setContact(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setMessage('Uploading image...');
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setContact(prev => ({ ...prev, image: data.url }));
            setMessage('Image uploaded!');
        } catch (error) {
            setMessage('Failed to upload image.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            });
            if (res.ok) {
                setMessage('Contact updated successfully!');
            } else {
                setMessage('Failed to update contact.');
            }
        } catch (error) {
            setMessage('Error saving data.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-4xl font-['Prompt',sans-serif]">
            {/* Premium Header with Dropdown */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
            </div>

            <h1 className="text-3xl font-['Tenor_Sans',serif] mb-8">Manage Contact Page</h1>

            <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg space-y-8 text-black">
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Basic Info</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Page Title</label>
                            <input name="title" value={contact.title} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="e.g., Get in Touch" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Intro Text</label>
                            <textarea name="intro" value={contact.intro} onChange={handleChange} rows={3} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="Brief introduction text..." />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Email Content</label>
                            <input name="email" value={contact.email} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">University</label>
                            <input name="university" value={contact.university} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Location</label>
                            <input name="location" value={contact.location} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Profile Image</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                                    <img src={contact.image} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Footer Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Footer Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                                    <img src={contact.footerLogo} alt="Footer Logo" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    setContact(prev => ({ ...prev, footerLogo: data.url }));
                                }} className="text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Footer Background</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                                    <img src={contact.footerBg} alt="Footer BG" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    setContact(prev => ({ ...prev, footerBg: data.url }));
                                }} className="text-xs" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Side Content</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Left Content Text</label>
                            <textarea name="leftText" value={contact.leftText} onChange={handleChange} rows={4} className="w-full border p-2 rounded bg-white" placeholder="Text to display on the left side..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Right Content Text</label>
                            <textarea name="rightText" value={contact.rightText} onChange={handleChange} rows={4} className="w-full border p-2 rounded bg-white" placeholder="Text to display on the right side..." />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Social Links</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Facebook URL</label>
                            <input name="social_facebook" value={contact.socials.facebook} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Instagram URL</label>
                            <input name="social_instagram" value={contact.socials.instagram} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">TikTok URL</label>
                            <input name="social_tiktok" value={contact.socials.tiktok} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                    </div>
                </section>

                {message && (
                    <p className={`text-sm font-bold text-center ${message.includes('success') || message.includes('uploaded') ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div >
    );
}
