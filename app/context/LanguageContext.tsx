'use client';

import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';

export type LanguageCode = 'en' | 'th' | 'zh' | 'de' | 'ru' | 'fr';

export const languages: { code: LanguageCode; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'th', label: 'Thai', nativeName: 'ไทย' },
    { code: 'zh', label: 'Chinese', nativeName: '中文' },
    { code: 'de', label: 'German', nativeName: 'Deutsch' },
    { code: 'ru', label: 'Russian', nativeName: 'Русский' },
    { code: 'fr', label: 'French', nativeName: 'Français' },
];

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: typeof translations['en'];
    textColor: string;
    setTextColor: (color: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<LanguageCode>(() => {
        if (typeof window === 'undefined') return 'en';
        const savedLang = localStorage.getItem('app-language');
        if (savedLang && languages.some((l) => l.code === savedLang)) {
            return savedLang as LanguageCode;
        }
        return 'en';
    });

    const [textColor, setTextColor] = useState<string>(() => {
        if (typeof window === 'undefined') return '#000000';
        const saved = localStorage.getItem('admin-text-color');
        if (typeof saved === 'string' && saved.trim()) return saved;
        return '#000000';
    });

    const handleSetLanguage = (lang: LanguageCode) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
    };

    const handleSetTextColor = (color: string) => {
        setTextColor(color);
        localStorage.setItem('admin-text-color', color);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, textColor, setTextColor: handleSetTextColor }}>
            {children}
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
