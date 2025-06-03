'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';
import { translations } from '@/lib/translations';

export function useOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const optimizePrompt = async (prompt: string): Promise<string> => {
    setIsOptimizing(true);
    
    try {
      // First try to use DeepSeek API (intelligent mode)
      try {
        // Simulate API call for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // This is where we would normally call the DeepSeek API
        // For demo purposes, we'll simulate a response with a more sophisticated optimization
        const intelligentOptimizedPrompt = getIntelligentOptimization(prompt);
        setIsOptimizing(false);
        return intelligentOptimizedPrompt;
      } catch (error) {
        // If DeepSeek API fails, fall back to basic optimization
        console.log('Falling back to basic optimization');
        const basicOptimizedPrompt = getBasicOptimization(prompt);
        setIsOptimizing(false);
        return basicOptimizedPrompt;
      }
    } catch (error) {
      setIsOptimizing(false);
      toast.error(t.optimizationError);
      throw error;
    }
  };

  // Basic optimization mode (fallback)
  const getBasicOptimization = (prompt: string): string => {
    return `你是专家。${prompt}。请提供主要观点的网页链接，以便核实。如遇不确定信息，请如实告知，不要编造。`;
  };

  // Intelligent optimization mode (using simulated DeepSeek API)
  const getIntelligentOptimization = (prompt: string): string => {
    // This is a simulation of what the DeepSeek API might return
    const domain = getDomain(prompt);
    
    // Example of an intelligent optimization that varies based on content
    return `你是${domain}领域的专家。${prompt}${prompt.includes('推荐') ? '，请详细说明每个推荐的优缺点和适用场景' : ''}。请提供主要观点的网页链接，以便核实。如遇不确定信息，请如实告知，不要编造。`;
  };

  // Helper function to determine the domain of expertise based on prompt
  const getDomain = (prompt: string): string => {
    const keywords: Record<string, string[]> = {
      '人工智能': ['AI', '人工智能', '机器学习', '深度学习', 'GPT', '大语言模型', '神经网络'],
      '编程': ['编程', '代码', 'Python', 'JavaScript', 'Java', '开发', '软件', '程序'],
      '教育': ['教育', '学习', '课程', '教学', '学校', '培训', '学生', '老师'],
      '健康': ['健康', '医疗', '疾病', '症状', '治疗', '医生', '药物', '饮食'],
      '商业': ['商业', '营销', '创业', '投资', '股票', '金融', '管理', '策略'],
      '科技': ['科技', '技术', '创新', '数字', '电子', '设备', '硬件', '软件'],
    };
    
    // Check which domain has the most keyword matches
    let bestDomain = '相关';
    let bestScore = 0;
    
    for (const [domain, domainKeywords] of Object.entries(keywords)) {
      const score = domainKeywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    }
    
    return bestDomain;
  };

  return {
    optimizePrompt,
    isOptimizing,
  };
}