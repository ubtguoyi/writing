"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'
import { ZhangButton } from '@/components/zhang'

/**
 * 底部导航组件
 * 在移动设备上显示的主导航栏
 * 使用章同学UI组件风格
 */
export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1"
            >
              <ZhangButton
                variant={isActive ? "default" : "ghost"}
                className="flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors border-none"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.name}</span>
              </ZhangButton>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 