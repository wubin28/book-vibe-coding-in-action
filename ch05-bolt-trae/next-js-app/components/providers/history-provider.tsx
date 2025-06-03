'use client';

import { createContext, useState, useCallback } from 'react';
import { HistoryItem } from '@/types';
import { useAuth } from '@/hooks/use-auth';

interface HistoryContextType {
  history: HistoryItem[];
  selectedHistory: HistoryItem | null;
  setSelectedHistory: (history: HistoryItem | null) => void;
  addHistory: (history: Omit<HistoryItem, 'id'>) => void;
  editHistoryTitle: (id: string, title: string) => void;
  deleteHistory: (id: string) => void;
  loadHistoryFromStorage: () => void;
  newOptimization: () => void;
}

export const HistoryContext = createContext<HistoryContextType>({
  history: [],
  selectedHistory: null,
  setSelectedHistory: () => {},
  addHistory: () => {},
  editHistoryTitle: () => {},
  deleteHistory: () => {},
  loadHistoryFromStorage: () => {},
  newOptimization: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const { user } = useAuth();

  const loadHistoryFromStorage = useCallback(() => {
    const storageKey = user ? `promptyoo-history-${user.id}` : 'promptyoo-history';
    const savedHistory = localStorage.getItem(storageKey);
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as HistoryItem[];
        // Sort by timestamp, newest first
        const sortedHistory = parsedHistory.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setHistory(sortedHistory);
      } catch (error) {
        console.error('Failed to parse history from storage', error);
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
    
    setSelectedHistory(null);
  }, [user]);

  const saveHistoryToStorage = useCallback((updatedHistory: HistoryItem[]) => {
    const storageKey = user ? `promptyoo-history-${user.id}` : 'promptyoo-history';
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
  }, [user]);

  const addHistory = useCallback((item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
    setSelectedHistory(null);
  }, [history, saveHistoryToStorage]);

  const editHistoryTitle = useCallback((id: string, title: string) => {
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, title } : item
    );
    
    setHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
    
    if (selectedHistory?.id === id) {
      setSelectedHistory({ ...selectedHistory, title });
    }
  }, [history, selectedHistory, saveHistoryToStorage]);

  const deleteHistory = useCallback((id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
    
    if (selectedHistory?.id === id) {
      setSelectedHistory(null);
    }
  }, [history, selectedHistory, saveHistoryToStorage]);

  const newOptimization = useCallback(() => {
    setSelectedHistory(null);
    // 刷新浏览器页面
    window.location.reload();
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        selectedHistory,
        setSelectedHistory,
        addHistory,
        editHistoryTitle,
        deleteHistory,
        loadHistoryFromStorage,
        newOptimization,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}