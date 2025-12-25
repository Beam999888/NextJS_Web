'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export type LanguageCode = 'en' | 'th' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

export const languages: { code: LanguageCode; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'th', label: 'Thai', nativeName: 'ไทย' },
    { code: 'zh', label: 'Mandarin Chinese', nativeName: '普通话' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', label: 'Spanish', nativeName: 'Español' },
    { code: 'fr', label: 'French', nativeName: 'Français' },
    { code: 'ar', label: 'Modern Standard Arabic', nativeName: 'العربية' },
    { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pt', label: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', label: 'Russian', nativeName: 'Русский' },
    { code: 'ur', label: 'Urdu', nativeName: 'اردو' },
];

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<LanguageCode>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('app-language') as LanguageCode;
        if (savedLang && languages.some(l => l.code === savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: LanguageCode) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            <div className={['ar', 'ur'].includes(language) ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
