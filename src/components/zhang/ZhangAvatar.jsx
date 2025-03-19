"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * 章同学头像组件
 * @param {Object} props 组件属性
 * @param {'default' | 'happy' | 'thinking' | 'surprised' | 'sad'} props.mood - 章同学的心情
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - 头像大小
 * @param {string} props.className - 额外的CSS类名
 */
export function ZhangAvatar({ 
  mood = 'default', 
  size = 'md', 
  className,
  ...props 
}) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  // 章同学不同心情的头像URL
  const moodSrc = {
    default: '/images/zhang/zhang-default.svg',
    happy: '/images/zhang/zhang-happy.svg',
    thinking: '/images/zhang/zhang-thinking.svg',
    surprised: '/images/zhang/zhang-surprised.svg',
    sad: '/images/zhang/zhang-sad.svg'
  };

  return (
    <div className={cn(
      'relative rounded-full overflow-hidden bg-primary/10',
      sizeClasses[size],
      className
    )} {...props}>
      {/* 章同学头像 */}
      <div className="relative w-full h-full">
        <Image
          src={moodSrc[mood] || moodSrc.default}
          alt={`章同学 ${mood} 表情`}
          fill
          className="object-cover"
          priority
        />
        
        {/* 气泡装饰 */}
        <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary/30 animate-pulse" />
        <div className="absolute left-1 -bottom-1 w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-300" />
      </div>
    </div>
  );
}

/**
 * 章同学完整形象组件（带触手）
 */
export function ZhangFull({ 
  mood = 'default',
  className,
  ...props
}) {
  return (
    <div className={cn(
      'relative w-64 h-64',
      className
    )} {...props}>
      {/* 章同学全身像（中间为头部，周围有触手） */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ZhangAvatar mood={mood} size="lg" />
      </div>
      
      {/* 触手装饰（8个） */}
      <div className="zhang-tentacle h-16 left-16 top-4 transform -rotate-45"></div>
      <div className="zhang-tentacle h-16 right-16 top-4 transform rotate-45"></div>
      <div className="zhang-tentacle h-16 left-8 top-16 transform -rotate-12"></div>
      <div className="zhang-tentacle h-16 right-8 top-16 transform rotate-12"></div>
      <div className="zhang-tentacle h-16 left-8 bottom-16 transform rotate-12"></div>
      <div className="zhang-tentacle h-16 right-8 bottom-16 transform -rotate-12"></div>
      <div className="zhang-tentacle h-16 left-16 bottom-4 transform rotate-45"></div>
      <div className="zhang-tentacle h-16 right-16 bottom-4 transform -rotate-45"></div>
      
      {/* 气泡装饰 */}
      <div className="zhang-bubble w-6 h-6 left-12 top-12"></div>
      <div className="zhang-bubble w-4 h-4 right-10 bottom-10 animate-pulse delay-700"></div>
      <div className="zhang-bubble w-3 h-3 left-20 bottom-8 animate-pulse delay-500"></div>
    </div>
  );
}

/**
 * 章同学的表情气泡组件
 */
export function ZhangBubble({ 
  children,
  position = 'right',
  className,
  ...props 
}) {
  return (
    <div className={cn(
      'relative bg-white p-4 rounded-2xl shadow-sm border border-border',
      position === 'left' ? 'rounded-bl-none' : 'rounded-br-none',
      className
    )} {...props}>
      {/* 气泡内容 */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 气泡尾巴 */}
      <div 
        className={cn(
          'absolute bottom-0 w-4 h-4 bg-white border-b border-r border-border',
          position === 'left' 
            ? '-left-2 transform rotate-45' 
            : '-right-2 transform -rotate-45'
        )}
      />
    </div>
  );
} 