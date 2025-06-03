'use client';

import { Sidebar } from '@/components/layouts/sidebar';
import { Header } from '@/components/layouts/header';
import { useEffect } from 'react';
import { useHistory } from '@/hooks/use-history';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadHistoryFromStorage } = useHistory();

  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="h-full flex flex-col">
          <Header />
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}