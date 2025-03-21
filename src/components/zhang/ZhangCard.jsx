"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ZhangAvatar } from './ZhangAvatar';

/**
 * 章同学主题卡片组件
 */
export function ZhangCard({
  children,
  className,
  highlighted = false,
  withBubbles = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm p-4 border border-border relative overflow-hidden transition-all duration-300',
        highlighted && 'bg-zhang-blue-light/30',
        className
      )}
      {...props}
    >
      {/* 内容 */}
      <div className="relative z-10 zhang-text">
        {children}
      </div>
      
      {/* 装饰气泡 */}
      {withBubbles && (
        <>
          <div className="zhang-bubble w-6 h-6 -right-2 -top-2 opacity-30" />
          <div className="zhang-bubble w-4 h-4 right-12 -bottom-1 opacity-20 animate-pulse delay-300" />
          <div className="zhang-bubble w-3 h-3 left-6 -bottom-1 opacity-10 animate-pulse delay-700" />
        </>
      )}
    </div>
  );
}

/**
 * 章同学主题的进度卡片
 */
export function ZhangProgressCard({
  title,
  description,
  value,
  max = 100,
  mood = 'default',
  className,
  ...props
}) {
  // 计算进度百分比
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // 根据进度设置心情
  const getMood = () => {
    if (percentage >= 80) return 'happy';
    if (percentage >= 40) return 'default';
    if (percentage >= 20) return 'thinking';
    return 'sad';
  };
  
  const currentMood = mood || getMood();
  
  return (
    <ZhangCard
      className={cn('flex flex-col space-y-3', className)}
      {...props}
    >
      {/* 卡片标题和头像 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <ZhangAvatar mood={currentMood} size="sm" />
      </div>
      
      {/* 进度条 */}
      <div className="zhang-progress">
        <div 
          className="zhang-progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* 进度数值 */}
      <div className="text-sm text-right text-muted-foreground">
        {value} / {max}
      </div>
    </ZhangCard>
  );
}

/**
 * 章同学主题的成就卡片
 */
export function ZhangAchievementCard({
  title,
  description,
  complete = false,
  icon,
  className,
  ...props
}) {
  return (
    <ZhangCard
      className={cn(
        'flex items-center gap-4 p-4 transition-all duration-300',
        complete ? 'bg-accent/10 border-accent/30' : '',
        className
      )}
      {...props}
    >
      {/* 成就图标 */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center',
        complete ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {icon || (complete ? '✓' : '?')}
      </div>
      
      {/* 成就内容 */}
      <div className="flex-1">
        <h3 className={cn(
          'font-medium',
          complete && 'text-accent-foreground'
        )}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* 完成状态 */}
      {complete && (
        <div className="text-accent text-sm font-medium">已完成</div>
      )}
    </ZhangCard>
  );
} 