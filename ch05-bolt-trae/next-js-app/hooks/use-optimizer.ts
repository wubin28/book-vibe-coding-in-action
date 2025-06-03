'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';
import { translations } from '@/lib/translations';

export function useOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const optimizePrompt = async (prompt: string, apiKey: string, onStreamUpdate?: (chunk: string) => void): Promise<string> => {
    setIsOptimizing(true);
    
    try {
      // First try to use DeepSeek API (intelligent mode)
      try {
        console.log('🚀 开始调用 DeepSeek API 进行智能优化...');
        console.log('📝 原始提示词:', prompt);
        
        const intelligentOptimizedPrompt = await callDeepSeekAPIWithStreaming(prompt, apiKey, onStreamUpdate);
        
        console.log('✅ DeepSeek API 调用成功');
        console.log('🎯 优化后的提示词:', intelligentOptimizedPrompt);
        
        setIsOptimizing(false);
        return intelligentOptimizedPrompt;
      } catch (error) {
        // If DeepSeek API fails, fall back to basic optimization
        console.log('❌ DeepSeek API 调用失败，切换到基础优化模式');
        console.error('错误详情:', error);
        
        const basicOptimizedPrompt = getBasicOptimization(prompt);
        
        console.log('🔄 使用基础优化模式完成');
        console.log('📋 基础优化结果:', basicOptimizedPrompt);
        
        // 模拟基础模式的流式输出
        if (onStreamUpdate) {
          console.log('📺 开始模拟基础模式流式输出...');
          await simulateStreamingForBasicMode(basicOptimizedPrompt, onStreamUpdate);
        }
        
        setIsOptimizing(false);
        return basicOptimizedPrompt;
      }
    } catch (error) {
      setIsOptimizing(false);
      console.error('💥 优化过程发生严重错误:', error);
      toast.error(t.optimizationError);
      throw error;
    }
  };

  // Call DeepSeek API for intelligent optimization with streaming
  const callDeepSeekAPIWithStreaming = async (prompt: string, apiKey: string, onStreamUpdate?: (chunk: string) => void): Promise<string> => {
    console.log('🔗 正在连接 DeepSeek API...');
    
    const systemPrompt = `请按以下步骤优化用户给出的原始提示词：

1. 创建一个空的"辅助优化提示词"，用于优化用户提供的原始提示词（见后文）。

2. 如果原始提示词未指定AI要扮演的角色，请根据提示词内容确定相关领域，然后在"辅助优化提示词"后添加"你是xxx领域的专家"。这里的"xxx"指你根据提示词确定的专业领域。

3. 如果原始提示词未说明回复格式要求，在"辅助优化提示词"后添加"请提供主要观点的网页链接，以便核实"。

4. 如果原始提示词未提及用户对AI的顾虑，在"辅助优化提示词"后添加"如遇不确定信息，请如实告知，不要编造"。

5. 使用整理好的"辅助优化提示词"优化下面的原始提示词。确保优化后的提示词清晰流畅，且只提供优化后的提示词，不要在结果提示词之前和之后附加其他说明。

用户的原始提示词是：${prompt}`;

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true // 启用流式响应
    };

    console.log('📤 发送流式请求到 DeepSeek API');
    console.log('🔧 请求参数:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 收到 DeepSeek API 流式响应');
    console.log('📊 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚫 API 响应错误:', errorText);
      throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    console.log('🌊 开始处理流式数据...');

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ 流式数据接收完成');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              console.log('🏁 收到流式结束标记');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                console.log('📝 收到流式内容片段:', content);
                fullContent += content;
                
                // 调用回调函数更新UI
                if (onStreamUpdate) {
                  onStreamUpdate(fullContent);
                }
              }
            } catch (parseError) {
              console.warn('⚠️ 解析流式数据失败:', parseError, '原始数据:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!fullContent.trim()) {
      console.error('🔍 流式响应内容为空');
      throw new Error('DeepSeek API 流式响应内容为空');
    }

    const optimizedPrompt = fullContent.trim();
    
    // 清理可能的前缀
    const cleanedPrompt = optimizedPrompt.replace(/^优化后的提示词[：:]*\s*/, '');
    
    console.log('🎉 流式响应完成，最终优化后的提示词:', cleanedPrompt);
    
    return cleanedPrompt;
  };

  // 模拟基础模式的流式输出
  const simulateStreamingForBasicMode = async (content: string, onStreamUpdate: (chunk: string) => void): Promise<void> => {
    const words = content.split('');
    let currentContent = '';
    
    for (let i = 0; i < words.length; i++) {
      currentContent += words[i];
      onStreamUpdate(currentContent);
      
      // 模拟打字效果，每个字符间隔30ms
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };

  // Basic optimization mode (fallback)
  const getBasicOptimization = (prompt: string): string => {
    return `你是专家。${prompt}。请提供主要观点的网页链接，以便核实。如遇不确定信息，请如实告知，不要编造。`;
  };

  // Helper function to determine the domain of expertise based on prompt
  const getDomain = (prompt: string): string => {
    const keywords: Record<string, string[]> = {
      '人工智能': ['AI', '人工智能', '机器学习', '深度学习', 'GPT', '大语言模型', '神经网络', '提示词'],
      '编程': ['编程', '代码', 'Python', 'JavaScript', 'Java', '开发', '软件', '程序', '算法'],
      '教育': ['教育', '学习', '课程', '教学', '学校', '培训', '学生', '老师', '知识'],
      '健康': ['健康', '医疗', '疾病', '症状', '治疗', '医生', '药物', '饮食', '养生'],
      '商业': ['商业', '营销', '创业', '投资', '股票', '金融', '管理', '策略', '市场'],
      '科技': ['科技', '技术', '创新', '数字', '电子', '设备', '硬件', '软件', '互联网'],
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