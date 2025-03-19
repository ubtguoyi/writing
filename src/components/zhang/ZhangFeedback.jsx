"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ZhangAvatar, ZhangBubble } from './ZhangAvatar';
import { ZhangCard } from './ZhangCard';
import { ZhangButton } from './ZhangButton';

/**
 * 章同学的作文反馈组件
 */
export function ZhangFeedback({
  className,
  essayContent,
  feedback,
  overallScore,
  ...props
}) {
  const [activeTab, setActiveTab] = React.useState('feedback');
  
  // 将反馈按类型分组
  const groupedFeedback = React.useMemo(() => {
    if (!feedback || !Array.isArray(feedback)) return {};
    
    return feedback.reduce((acc, item) => {
      const type = item.type || '其他';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  }, [feedback]);
  
  // 反馈类型的颜色映射
  const typeColors = {
    '语法': 'text-blue-500 bg-blue-50',
    '词汇': 'text-green-500 bg-green-50',
    '结构': 'text-purple-500 bg-purple-50',
    '内容': 'text-amber-500 bg-amber-50',
    '其他': 'text-gray-500 bg-gray-50'
  };
  
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* 页面标题和分数 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ZhangAvatar 
            mood={overallScore >= 80 ? 'happy' : overallScore >= 60 ? 'default' : 'thinking'} 
            size="md" 
          />
          <div>
            <h2 className="text-xl font-bold">作文反馈</h2>
            <p className="text-sm text-muted-foreground">章同学已经认真批改了你的作文</p>
          </div>
        </div>
        
        {overallScore !== undefined && (
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{overallScore}</div>
            <div className="text-sm text-muted-foreground">分</div>
          </div>
        )}
      </div>
      
      {/* 标签切换 */}
      <div className="flex border-b border-border">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'feedback'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('feedback')}
        >
          章同学反馈
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'original'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('original')}
        >
          原文
        </button>
      </div>
      
      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === 'feedback' ? (
          <div className="space-y-6">
            {/* 章同学的总体评价 */}
            <ZhangCard withBubbles>
              <div className="flex items-start gap-4">
                <ZhangAvatar mood="happy" size="md" />
                <ZhangBubble className="flex-1">
                  <h3 className="font-medium text-lg mb-2">总体评价</h3>
                  <p className="text-foreground">
                    这篇作文结构清晰，思路明确。语言表达流畅，用词准确。
                    有些地方可以进一步丰富内容，增加细节描写。
                    请注意一些语法错误和标点符号的使用。
                  </p>
                </ZhangBubble>
              </div>
            </ZhangCard>
            
            {/* 分类反馈 */}
            {Object.entries(groupedFeedback).map(([type, items]) => (
              <div key={type} className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    typeColors[type] || typeColors['其他']
                  )}>
                    {type}
                  </span>
                  <span>相关建议</span>
                </h3>
                
                <div className="space-y-3 pl-4 border-l-2 border-muted">
                  {items.map((item, index) => (
                    <FeedbackItem 
                      key={index} 
                      item={item} 
                      typeColor={typeColors[type] || typeColors['其他']} 
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {(!feedback || !feedback.length) && (
              <div className="relative">
                {/* 默认反馈示例 */}
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  <FeedbackItem 
                    item={{
                      original: "我的家乡很美丽，有很多树和花。",
                      suggestion: "我的家乡风景如画，郁郁葱葱的树木与五彩斑斓的花朵相映成趣。",
                      explanation: "可以使用更加丰富的词汇和修辞手法来增强描写的生动性。"
                    }}
                    typeColor={typeColors['词汇']} 
                  />
                  
                  <FeedbackItem 
                    item={{
                      original: "我每天都去学校。我学习很认真。我喜欢数学。",
                      suggestion: "我每天都去学校，学习态度十分认真，尤其钟爱数学课。",
                      explanation: "可以将简短的句子合并，使用连接词增强句子间的连贯性。"
                    }}
                    typeColor={typeColors['结构']} 
                  />
                </div>
                
                {/* 触手连接装饰 */}
                <div className="zhang-tentacle h-24 absolute -left-4 top-8 transform rotate-12"></div>
                <div className="zhang-tentacle h-32 absolute -left-8 bottom-8 transform -rotate-15"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="prose max-w-none p-4 bg-white rounded-lg border border-border">
            {essayContent || (
              <p className="text-muted-foreground italic">作文内容将显示在这里...</p>
            )}
          </div>
        )}
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-between pt-4">
        <ZhangButton variant="outline">
          保存反馈
        </ZhangButton>
        <ZhangButton>
          应用修改建议
        </ZhangButton>
      </div>
    </div>
  );
}

/**
 * 单条反馈项目组件
 */
function FeedbackItem({ item, typeColor }) {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-border p-3 hover:shadow-sm transition-shadow">
      <div className="space-y-2">
        {/* 原文 */}
        {item.original && (
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">原文:</span>
            <span className="line-through decoration-red-300">{item.original}</span>
          </div>
        )}
        
        {/* 建议 */}
        {item.suggestion && (
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">建议:</span>
            <span className="text-primary font-medium">{item.suggestion}</span>
          </div>
        )}
        
        {/* 展开/收起解释 */}
        {item.explanation && (
          <div className="pt-1">
            <button 
              className="text-xs text-secondary hover:underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '收起解释' : '查看解释'}
            </button>
            
            {expanded && (
              <div className="mt-2 text-sm bg-muted/30 p-2 rounded text-muted-foreground">
                {item.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 