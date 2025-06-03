import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Language } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHistoryDate(timestamp: string, language: Language): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return language === 'en' ? 'Today' : '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return language === 'en' ? 'Yesterday' : '昨天';
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', options);
  }
}