'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
    const { t } = useLanguage();
    const [contact, setContact] = useState<any>(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/contact');
                const data = await res.json();
                setContact(data);
            } catch (error) {
                console.error('Failed to fetch contact data', error);
            }
        };
        fetchContact();
    }, []);

    if (!contact) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-20 max-w-6xl">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-14 shadow-lg">
                <div className="text-center mb-20 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-['Tenor_Sans',serif] mb-6">{contact.title || t.contact.title}</h1>
                    <p className="text-black font-light max-w-xl mx-auto whitespace-pre-line">
                        {contact.intro || t.contact.intro}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Centered Profile Image */}
                    <div className="w-44 h-44 mx-auto mb-16 rounded-full overflow-hidden shadow-2xl border-4 border-white animate-fade-in-up">
                        <img src={contact.image} alt="Anukun Boontha" className="w-full h-full object-cover" />
                    </div>

                    {/* 3-Column Grid for All Info */}
                    <div className="grid lg:grid-cols-3 gap-12 items-start text-center">

                        {/* Left Column (Left Text) */}
                        <div className="lg:text-right space-y-4 lg:pt-2">
                            {contact.leftText && (
                                <p className="text-sm text-black font-bold leading-loose whitespace-pre-line uppercase tracking-widest">
                                    {contact.leftText}
                                </p>
                            )}
                        </div>

                        {/* Middle Column (Main Info) */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-black opacity-40">{t.contact.universityLabel}</h3>
                                <p className="text-base text-black font-bold leading-relaxed">
                                    {contact.university}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-black opacity-40">{t.contact.locationLabel}</h3>
                                <p className="text-base text-black font-bold leading-relaxed">
                                    {contact.location}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-black opacity-40">{t.contact.contactLabel}</h3>
                                <p className="text-base text-black font-bold leading-relaxed">
                                    {contact.email}
                                </p>
                            </div>
                        </div>

                        {/* Right Column (Right Text) */}
                        <div className="lg:text-left space-y-4 lg:pt-2">
                            {contact.rightText && (
                                <p className="text-sm text-black font-bold leading-loose whitespace-pre-line uppercase tracking-widest">
                                    {contact.rightText}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Social Icons at the Bottom */}
                    <div className="mt-20 text-center">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-black opacity-40">{t.contact.socialsLabel}</h3>
                        <div className="flex justify-center gap-8">
                            {contact.socials.facebook && (
                                <a href={contact.socials.facebook} target="_blank" className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-2xl hover:scale-110 transition-all text-blue-600">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
                                </a>
                            )}
                            {contact.socials.instagram && (
                                <a href={contact.socials.instagram} target="_blank" className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-2xl hover:scale-110 transition-all text-pink-600">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0-3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                            )}
                            {contact.socials.tiktok && (
                                <a href={contact.socials.tiktok} target="_blank" className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-2xl hover:scale-110 transition-all text-black">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
