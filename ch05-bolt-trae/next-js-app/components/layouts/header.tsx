'use client';

import { useTheme } from 'next-themes';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Languages } from 'lucide-react';
import { translations } from '@/lib/translations';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold">{t.aiPromptOptimizer}</h1>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          title={t.changeLanguage}
        >
          <Languages className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={t.toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}