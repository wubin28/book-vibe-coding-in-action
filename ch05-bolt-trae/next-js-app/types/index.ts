export type Language = 'en' | 'zh';

export interface User {
  id: string;
  username: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  originalPrompt: string;
  optimizedPrompt: string;
  timestamp: string;
}