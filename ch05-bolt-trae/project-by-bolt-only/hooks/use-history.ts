'use client';

import { useContext } from 'react';
import { HistoryContext } from '@/components/providers/history-provider';

export function useHistory() {
  const context = useContext(HistoryContext);
  
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  
  return context;
}