"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'

/**
 * 底部导航组件
 * 在移动设备上显示的主导航栏
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
              className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 