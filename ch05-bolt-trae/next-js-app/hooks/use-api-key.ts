'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ApiKeyState {
  hasApiKey: boolean;
  isLoading: boolean;
  isChecking: boolean;
}

export function useApiKey() {
  const [state, setState] = useState<ApiKeyState>({
    hasApiKey: false,
    isLoading: false,
    isChecking: true
  });

  // 检查是否已有API密钥
  const checkApiKey = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isChecking: true }));
      
      const response = await fetch('/api/api-key', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        hasApiKey: data.hasApiKey || false,
        isChecking: false
      }));
      
      return data.hasApiKey ? data.apiKey : null;
    } catch (error) {
      console.error('检查API密钥失败:', error);
      setState(prev => ({ ...prev, hasApiKey: false, isChecking: false }));
      return null;
    }
  }, []);

  // 存储API密钥
  const storeApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ apiKey })
      });
      
      if (response.ok) {
        setState(prev => ({ ...prev, hasApiKey: true, isLoading: false }));
        console.log('✅ API密钥已安全存储到后端');
        return true;
      } else {
        throw new Error('存储失败');
      }
    } catch (error) {
      console.error('存储API密钥失败:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('存储API密钥失败，请重试');
      return false;
    }
  }, []);

  // 清除API密钥
  const clearApiKey = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/api-key', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setState(prev => ({ ...prev, hasApiKey: false }));
        console.log('🗑️ API密钥已从后端清除');
        toast.success('API密钥已清除');
        return true;
      } else {
        throw new Error('清除失败');
      }
    } catch (error) {
      console.error('清除API密钥失败:', error);
      toast.error('清除API密钥失败');
      return false;
    }
  }, []);

  // 获取API密钥（仅用于实际API调用）
  const getApiKey = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/api-key', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      return data.hasApiKey ? data.apiKey : null;
    } catch (error) {
      console.error('获取API密钥失败:', error);
      return null;
    }
  }, []);

  // 组件挂载时检查API密钥
  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  return {
    hasApiKey: state.hasApiKey,
    isLoading: state.isLoading,
    isChecking: state.isChecking,
    checkApiKey,
    storeApiKey,
    clearApiKey,
    getApiKey
  };
} 