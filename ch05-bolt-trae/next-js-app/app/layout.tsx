import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/components/providers/language-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { HistoryProvider } from '@/components/providers/history-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Promptyoo-1 - AI Prompt Optimizer',
  description: 'Optimize your AI prompts with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="promptyoo-theme"
        >
          <LanguageProvider>
            <AuthProvider>
              <HistoryProvider>
                {children}
                <Toaster />
              </HistoryProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}