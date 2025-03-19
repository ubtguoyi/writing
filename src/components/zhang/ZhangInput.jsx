"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ZhangButton } from './ZhangButton';

/**
 * 章同学主题输入框组件
 */
export function ZhangInput({
  className,
  error,
  label,
  helpText,
  ...props
}) {
  const id = React.useId();
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          className={cn(
            'w-full rounded-lg bg-muted/50 border border-input px-3 py-2',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'transition-all duration-200 hover:bg-muted/70',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        
        {/* 气泡装饰 - 聚焦时显示 */}
        <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-primary/0 peer-focus:bg-primary/30 
                      transition-all duration-300 peer-focus:animate-pulse" />
      </div>
      
      {/* 错误信息或帮助文本 */}
      {(error || helpText) && (
        <p className={cn(
          "text-xs",
          error ? "text-destructive" : "text-muted-foreground"
        )}>
          {error || helpText}
        </p>
      )}
    </div>
  );
}

/**
 * 章同学主题文本区域组件
 */
export function ZhangTextarea({
  className,
  error,
  label,
  helpText,
  ...props
}) {
  const id = React.useId();
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        <textarea
          id={id}
          className={cn(
            'w-full rounded-lg bg-muted/50 border border-input px-3 py-2',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'transition-all duration-200 hover:bg-muted/70 min-h-[120px] resize-y',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        
        {/* 触手装饰 - 仅在文本区域组件上使用 */}
        <div className="opacity-0 zhang-tentacle h-16 -left-1 bottom-8 transform rotate-45 group-focus-within:opacity-60 transition-all duration-300" />
        <div className="opacity-0 zhang-tentacle h-16 -right-1 bottom-8 transform -rotate-45 group-focus-within:opacity-60 transition-all duration-300" />
      </div>
      
      {/* 错误信息或帮助文本 */}
      {(error || helpText) && (
        <p className={cn(
          "text-xs",
          error ? "text-destructive" : "text-muted-foreground"
        )}>
          {error || helpText}
        </p>
      )}
    </div>
  );
}

/**
 * 作文输入区域组件
 */
export function ZhangEssayInput({
  className,
  onSubmit,
  ...props
}) {
  const [value, setValue] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    if (onSubmit) {
      await onSubmit(value);
    }
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="relative">
        <ZhangTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请在这里输入你的作文..."
          label="我的作文"
          className="min-h-[200px]"
          {...props}
        />
        
        {/* 背景水波纹装饰 */}
        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-full h-full max-w-[110%] max-h-[110%] bg-primary/5 rounded-full filter blur-2xl opacity-30" />
      </div>
      
      <div className="flex justify-end">
        <ZhangButton
          type="submit"
          isLoading={isSubmitting}
          disabled={!value.trim() || isSubmitting}
        >
          提交给章同学
        </ZhangButton>
      </div>
    </form>
  );
} 