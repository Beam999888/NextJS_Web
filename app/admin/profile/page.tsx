'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProfileData {
    pageTitle: string;
    pageDescription: string;
    name: string;
    age: string;
    pronouns: string;
    bio: string;
    education: {
        university: string;
        faculty: string;
        program: string;
        year: string;
    };
    contact: {
        instagram: string;
        facebook: string;
        tiktok: string;
    };
    learning: string[];
    tools: string[];
    profileImage: string;
}

const initialProfile: ProfileData = {
    pageTitle: '',
    pageDescription: '',
    name: '',
    age: '',
    pronouns: '',
    bio: '',
    education: { university: '', faculty: '', program: '', year: '' },
    contact: { instagram: '', facebook: '', tiktok: '' },
    learning: [],
    tools: [],
    profileImage: ''
};

export default function AdminProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData>(initialProfile);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    // Merge with initial to ensure all fields exist
                    setProfile({ ...initialProfile, ...data, education: { ...initialProfile.education, ...(data.education || {}) }, contact: { ...initialProfile.contact, ...(data.contact || {}) } });
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section: 'education' | 'contact', field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (field: 'learning' | 'tools', index: number, value: string) => {
        const newArray = [...profile[field]];
        newArray[index] = value;
        setProfile(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'learning' | 'tools') => {
        setProfile(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field: 'learning' | 'tools', index: number) => {
        const newArray = profile[field].filter((_, i) => i !== index);
        setProfile(prev => ({ ...prev, [field]: newArray }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSubmitting(true);
        setMessage('Uploading image...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, profileImage: data.url }));
                setMessage('Image uploaded successfully!');
            } else {
                setMessage('Failed to upload image.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error uploading image.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage('Profile updated successfully!');
                router.refresh(); // Refresh server components if needed
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error updating profile.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-4xl font-['Prompt',sans-serif]">
            {/* Premium Header with Dropdown */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
            </div>

            <h1 className="text-3xl font-['Tenor_Sans',serif] mb-8">Edit Full Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-12 bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg">
                {/* Page Header */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Page Header</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Page Title</label>
                            <input
                                name="pageTitle"
                                value={profile.pageTitle}
                                onChange={handleChange}
                                placeholder="e.g., Profile"
                                className="w-full border p-2 rounded bg-white font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Page Description</label>
                            <textarea
                                name="pageDescription"
                                rows={2}
                                value={profile.pageDescription}
                                onChange={handleChange}
                                placeholder="Subtitle for the profile page..."
                                className="w-full border p-2 rounded bg-white resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Personal Info */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Personal Info</h2>

                    {/* Profile Image Upload */}
                    <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-black/5">
                        <div className="w-48 h-48 bg-white border border-black/10 rounded-2xl overflow-hidden relative group">
                            {profile.profileImage ? (
                                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-black/20 text-[10px] font-bold uppercase tracking-widest text-center px-4">
                                    No image uploaded
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-black">Profile Portrait</label>
                            <p className="text-[10px] text-black/40 uppercase tracking-widest leading-relaxed">Recommended: Square image, high resolution (JPG or PNG).</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-[10px] text-black/40 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-black file:text-white file:cursor-pointer transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Display Name</label>
                            <input
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Pronouns</label>
                            <input
                                name="pronouns"
                                value={profile.pronouns}
                                onChange={handleChange}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Age</label>
                            <input
                                name="age"
                                value={profile.age}
                                onChange={handleChange}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2 col-span-full">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Bio</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={profile.bio}
                                onChange={handleChange}
                                className="w-full border p-2 rounded bg-white resize-y"
                            />
                        </div>
                    </div>
                </section>

                {/* Education */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Education</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">University</label>
                            <input
                                value={profile.education.university}
                                onChange={(e) => handleNestedChange('education', 'university', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Faculty</label>
                            <input
                                value={profile.education.faculty}
                                onChange={(e) => handleNestedChange('education', 'faculty', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Program</label>
                            <input
                                value={profile.education.program}
                                onChange={(e) => handleNestedChange('education', 'program', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Year</label>
                            <input
                                value={profile.education.year}
                                onChange={(e) => handleNestedChange('education', 'year', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Contact</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Instagram</label>
                            <input
                                value={profile.contact.instagram}
                                onChange={(e) => handleNestedChange('contact', 'instagram', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">Facebook</label>
                            <input
                                value={profile.contact.facebook}
                                onChange={(e) => handleNestedChange('contact', 'facebook', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black">TikTok</label>
                            <input
                                value={profile.contact.tiktok}
                                onChange={(e) => handleNestedChange('contact', 'tiktok', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            />
                        </div>
                    </div>
                </section>

                {/* What I'm Learning */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 flex justify-between items-center">
                        What I'm Learning
                        <button type="button" onClick={() => addArrayItem('learning')} className="text-xs bg-black text-white px-3 py-1 rounded">
                            + Add Item
                        </button>
                    </h2>
                    <div className="space-y-3">
                        {profile.learning.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => handleArrayChange('learning', index, e.target.value)}
                                    className="w-full border p-2 rounded bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('learning', index)}
                                    className="text-red-500 hover:text-red-700 px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tools */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 flex justify-between items-center">
                        Tools I Have Used
                        <button type="button" onClick={() => addArrayItem('tools')} className="text-xs bg-black text-white px-3 py-1 rounded">
                            + Add Tool
                        </button>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {profile.tools.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                                    className="w-full border p-2 rounded bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('tools', index)}
                                    className="text-red-500 hover:text-red-700 px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {message && (
                    <div className={`p-4 rounded-lg text-center font-bold ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Saving Profile...' : 'Save All Changes'}
                </button>
            </form>
        </div >
    );
}
