import { useState, useEffect } from 'react';
import enStrings from '../i18n/en.json';
import frStrings from '../i18n/fr.json';

const translations = {
    en: enStrings,
    fr: frStrings,
};

export const useI18n = () => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return { t, language, setLanguage };
};

export default useI18n;
