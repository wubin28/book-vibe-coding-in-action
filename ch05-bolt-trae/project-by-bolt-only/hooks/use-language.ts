'use client';

import { useContext, useCallback } from 'react';
import { LanguageContext } from '@/components/providers/language-provider';
import { Language } from '@/types';

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  const toggleLanguage = useCallback(() => {
    const newLanguage: Language = context.language === 'en' ? 'zh' : 'en';
    context.setLanguage(newLanguage);
  }, [context]);
  
  return {
    language: context.language,
    setLanguage: context.setLanguage,
    toggleLanguage,
  };
}