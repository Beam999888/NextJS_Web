'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileData {
    pageTitle?: string;
    pageDescription?: string;
    profileImage?: string;
    name?: string;
    pronouns?: string;
    age?: string;
    bio?: string;
    contact?: {
        instagram?: string;
        facebook?: string;
        tiktok?: string;
    };
    education?: {
        university?: string;
        faculty?: string;
        program?: string;
        year?: string;
    };
    learning?: string[];
    tools?: string[];
}

export default function Profile() {
    const { t } = useLanguage();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                const data = (await res.json()) as ProfileData;
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading || !profile) {
        return <div className="p-20 text-center">{t.profile.loading}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-['Tenor_Sans',serif] mb-6">{profile.pageTitle || t.profile.title}</h1>
                    <div className="w-12 h-[2px] bg-black mx-auto mb-8"></div>
                    {profile.pageDescription && (
                        <p className="max-w-xl mx-auto text-black/60 font-light leading-relaxed whitespace-pre-line">
                            {profile.pageDescription}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
                    {/* Left: Image Placeholder & Bio */}
                    <div>
                        <div className="w-full aspect-square bg-white border border-gray-200 mb-8 overflow-hidden rounded-2xl shadow-sm">
                            {profile.profileImage ? (
                                <img src={profile.profileImage} alt={profile.name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-black">
                                    <span className="tracking-widest uppercase text-xs">{t.profile.portrait}</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-['Tenor_Sans',serif] mb-2">{profile.name}</h2>
                        <p className="text-sm text-black font-light mb-4">{profile.pronouns} • {profile.age}</p>
                        <p className="text-black font-light leading-relaxed mb-6">
                            {profile.bio}
                        </p>

                        {/* Contact */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 border-b border-black/10 pb-2">{t.profile.contact}</h3>
                            <ul className="space-y-2 text-sm text-black font-light">
                                <li className="flex items-center gap-2">
                                    <span className="font-medium text-black">{t.profile.instagram}:</span> {profile.contact?.instagram}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="font-medium text-black">{t.profile.facebook}:</span> {profile.contact?.facebook}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="font-medium text-black">{t.profile.tiktok}:</span> {profile.contact?.tiktok}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-12">
                        {/* Education */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b border-black/10 pb-2">{t.profile.education}</h3>
                            <div className="mb-4">
                                <h4 className="text-lg font-serif">{profile.education?.university}</h4>
                                <p className="text-sm text-black font-medium mt-1">{profile.education?.faculty}</p>
                                <p className="text-sm text-black mt-1">{profile.education?.program}</p>
                                <p className="text-xs text-black mt-1">{profile.education?.year}</p>
                            </div>
                        </div>

                        {/* What I'm Learning */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b border-black/10 pb-2">{t.profile.learning}</h3>
                            <ul className="space-y-3 text-sm text-black font-light">
                                {profile.learning?.map((item: string, index: number) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Technical Skills / Tools */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b border-black/10 pb-2">{t.profile.tools}</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.tools?.map((tool: string, index: number) => (
                                    <span key={index} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-black border border-gray-200">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b border-black/10 pb-2">{t.profile.languages}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-black font-light">
                                <div>
                                    <span className="block font-medium text-black">{t.profile.thai}</span>
                                    <span>{t.profile.native}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-black">{t.profile.english}</span>
                                    <span>{t.profile.intermediate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
