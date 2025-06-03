'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Wand2, Key, Trash2 } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useOptimizer } from '@/hooks/use-optimizer';
import { useApiKey } from '@/hooks/use-api-key';
import { ApiKeyPrompt } from '@/components/ui/api-key-prompt';

export function PromptOptimizer() {
  const { language } = useLanguage();
  const t = translations[language];
  const { selectedHistory, addHistory } = useHistory();
  const { optimizePrompt, isOptimizing } = useOptimizer();
  const { hasApiKey, isLoading: apiKeyLoading, isChecking, storeApiKey, clearApiKey, getApiKey } = useApiKey();
  
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedHistory) {
      setPrompt(selectedHistory.originalPrompt);
      setOptimizedPrompt(selectedHistory.optimizedPrompt);
      setIsInputEmpty(false);
    }
  }, [selectedHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsInputEmpty(e.target.value.trim() === '');
  };

  const handleOptimizeClick = async () => {
    if (isInputEmpty) return;
    
    // 如果已有API密钥，直接开始优化
    if (hasApiKey) {
      const apiKey = await getApiKey();
      if (apiKey) {
        await startOptimization(apiKey);
      } else {
        // API密钥可能已过期，显示输入框
        setShowApiKeyDialog(true);
      }
    } else {
      // 没有API密钥，显示输入框
      setShowApiKeyDialog(true);
    }
  };

  const handleApiKeySubmit = async (apiKey: string) => {
    // 先存储API密钥到后端
    const stored = await storeApiKey(apiKey);
    if (stored) {
      // 存储成功后开始优化
      await startOptimization(apiKey);
    }
  };

  const startOptimization = async (apiKey: string) => {
    setOptimizedPrompt('');
    setIsStreaming(true);
    
    if (resultRef.current) {
      resultRef.current.classList.remove('animate-fade-in');
      resultRef.current.classList.add('animate-pulse');
    }
    
    try {
      // 流式更新回调函数
      const handleStreamUpdate = (chunk: string) => {
        console.log('🖥️ UI更新流式内容:', chunk.substring(0, 50) + (chunk.length > 50 ? '...' : ''));
        setOptimizedPrompt(chunk);
        
        // 移除脉冲动画，显示内容
        if (resultRef.current && resultRef.current.classList.contains('animate-pulse')) {
          resultRef.current.classList.remove('animate-pulse');
        }
      };
      
      const result = await optimizePrompt(prompt, apiKey, handleStreamUpdate);
      
      // 确保最终结果正确设置
      setOptimizedPrompt(result);
      
      // Save to history
      if (!selectedHistory || selectedHistory.originalPrompt !== prompt) {
        addHistory({
          title: prompt.length > 30 ? prompt.substring(0, 30) : prompt,
          originalPrompt: prompt,
          optimizedPrompt: result,
          timestamp: new Date().toISOString(),
        });
      }
      
      if (resultRef.current) {
        resultRef.current.classList.remove('animate-pulse');
        resultRef.current.classList.add('animate-fade-in');
      }
    } catch (error) {
      toast.error(t.optimizationError);
      if (resultRef.current) {
        resultRef.current.classList.remove('animate-pulse');
      }
    } finally {
      setIsStreaming(false);
      setShowApiKeyDialog(false);
    }
  };

  const handleClearApiKey = async () => {
    const success = await clearApiKey();
    if (success) {
      toast.success('API密钥已清除，下次使用时需要重新输入');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    toast.success(t.copiedToClipboard);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">{t.startFromALine}</h2>
          {hasApiKey && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Key className="h-4 w-4 text-green-500" />
              <span>API密钥已保存</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearApiKey}
                disabled={apiKeyLoading}
                className="h-6 px-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              {t.yourPromptToBeOptimized}
              <span className="text-destructive ml-1">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t.promptPlaceholder}
              value={prompt}
              onChange={handleInputChange}
              className="transition duration-200 min-h-[100px] resize-y"
              disabled={!!selectedHistory}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleOptimizeClick}
              disabled={isInputEmpty || isOptimizing || !!selectedHistory || isChecking}
              className={cn("w-full transition-all duration-300", 
                isInputEmpty ? "opacity-70" : "opacity-100"
              )}
            >
              {isOptimizing ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <Wand2 className="h-4 w-4" />
                  </span>
                  {isStreaming ? '流式优化中...' : t.optimizing}
                </div>
              ) : isChecking ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <Key className="h-4 w-4" />
                  </span>
                  检查API密钥...
                </div>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t.optimizePrompt}
                  {!hasApiKey && <Key className="ml-2 h-4 w-4 opacity-50" />}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <CardTitle className="text-base font-medium">
              {t.optimizedPrompt}
              {isStreaming && (
                <span className="ml-2 text-sm text-muted-foreground animate-pulse">
                  正在流式输出...
                </span>
              )}
            </CardTitle>
            {optimizedPrompt && !isStreaming && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div 
              ref={resultRef}
              className={cn(
                "min-h-[100px] p-3 rounded-md bg-muted/50 whitespace-pre-wrap",
                optimizedPrompt && "animate-fade-in",
                isStreaming && "border-l-4 border-primary"
              )}
            >
              {optimizedPrompt || (
                <span className="text-muted-foreground">
                  {t.optimizedPromptPlaceholder}
                </span>
              )}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ApiKeyPrompt
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSubmit={handleApiKeySubmit}
        isLoading={isOptimizing || apiKeyLoading}
      />
    </div>
  );
}