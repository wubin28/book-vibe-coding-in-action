'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ApiKeyPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
  isLoading?: boolean;
}

export function ApiKeyPrompt({ isOpen, onClose, onSubmit, isLoading = false }: ApiKeyPromptProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  const handleClose = () => {
    setApiKey('');
    setShowApiKey(false);
    onClose();
  };

  const translations = {
    en: {
      title: 'Enter DeepSeek API Key',
      description: 'Please enter your DeepSeek API key to optimize the prompt. The key will not be saved.',
      label: 'API Key',
      placeholder: 'sk-...',
      confirm: 'Confirm',
      cancel: 'Cancel',
      optimizing: 'Optimizing...',
    },
    zh: {
      title: '输入 DeepSeek API 密钥',
      description: '请输入您的 DeepSeek API 密钥以优化提示词。密钥不会被保存。',
      label: 'API 密钥',
      placeholder: 'sk-...',
      confirm: '确认',
      cancel: '取消',
      optimizing: '优化中...',
    }
  };

  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">{t.label}</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.placeholder}
                className="pr-10"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isLoading}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!apiKey.trim() || isLoading}
            >
              {isLoading ? t.optimizing : t.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 