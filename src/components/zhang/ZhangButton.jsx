"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 章同学主题按钮组件
 * @param {Object} props 组件属性
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} props.variant - 按钮变体
 * @param {'sm' | 'md' | 'lg'} props.size - 按钮大小
 * @param {boolean} props.isLoading - 是否显示加载状态
 * @param {React.ReactNode} props.icon - 按钮图标
 */
export function ZhangButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  ...props
}) {
  // 按钮大小类
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  // 按钮变体类
  const variantClasses = {
    primary: 'bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80',
    secondary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
    outline: 'bg-white border-2 border-secondary text-secondary hover:bg-secondary/5',
    ghost: 'bg-transparent hover:bg-muted/50 text-foreground'
  };

  // 加载动画
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      className={cn(
        'rounded-xl font-medium transition-all duration-200 shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2',
        'disabled:opacity-70 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2',
        sizeClasses[size],
        variantClasses[variant],
        isLoading && 'opacity-80',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

/**
 * 带有触手装饰的按钮组件
 */
export function ZhangTentacleButton({
  children,
  className,
  tentacleCount = 2,
  ...props
}) {
  return (
    <div className="relative group">
      {/* 触手装饰 */}
      {Array.from({ length: tentacleCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'zhang-tentacle h-10 opacity-0 group-hover:opacity-100 transition-all duration-300',
            i % 2 === 0 
              ? `left-${2 + i * 3} -top-8 transform -rotate-${15 + i * 10}`
              : `right-${2 + i * 3} -top-8 transform rotate-${15 + i * 10}`
          )}
          style={{ 
            transitionDelay: `${i * 100}ms`,
            height: '40px'
          }}
        />
      ))}
      
      {/* 按钮 */}
      <ZhangButton
        className={cn('group-hover:transform group-hover:scale-105', className)}
        {...props}
      >
        {children}
      </ZhangButton>
    </div>
  );
} 