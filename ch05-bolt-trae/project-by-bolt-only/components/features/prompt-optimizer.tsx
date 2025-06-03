'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Wand2 } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useOptimizer } from '@/hooks/use-optimizer';

export function PromptOptimizer() {
  const { language } = useLanguage();
  const t = translations[language];
  const { selectedHistory, addHistory } = useHistory();
  const { optimizePrompt, isOptimizing } = useOptimizer();
  
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedHistory) {
      setPrompt(selectedHistory.originalPrompt);
      setOptimizedPrompt(selectedHistory.optimizedPrompt);
      setIsInputEmpty(false);
    }
  }, [selectedHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setIsInputEmpty(e.target.value.trim() === '');
  };

  const handleOptimize = async () => {
    if (isInputEmpty) return;
    
    setOptimizedPrompt('');
    if (resultRef.current) {
      resultRef.current.classList.remove('animate-fade-in');
      resultRef.current.classList.add('animate-pulse');
    }
    
    try {
      const result = await optimizePrompt(prompt);
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
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    toast.success(t.copiedToClipboard);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">{t.startFromALine}</h2>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              {t.yourPromptToBeOptimized}
              <span className="text-destructive ml-1">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder={t.promptPlaceholder}
              value={prompt}
              onChange={handleInputChange}
              className="transition duration-200"
              disabled={!!selectedHistory}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleOptimize}
              disabled={isInputEmpty || isOptimizing || !!selectedHistory}
              className={cn("w-full transition-all duration-300", 
                isInputEmpty ? "opacity-70" : "opacity-100"
              )}
            >
              {isOptimizing ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <Wand2 className="h-4 w-4" />
                  </span>
                  {t.optimizing}
                </div>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t.optimizePrompt}
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
            </CardTitle>
            {optimizedPrompt && (
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
                optimizedPrompt && "animate-fade-in"
              )}
            >
              {optimizedPrompt || (
                <span className="text-muted-foreground">
                  {t.optimizedPromptPlaceholder}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}