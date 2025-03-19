"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'
import { ZhangAvatar, ZhangCard } from '@/components/zhang'

/**
 * 侧边导航组件
 * 在桌面/平板设备上显示的主导航栏
 * 使用章同学UI组件风格
 */
export function SideNav() {
  const pathname = usePathname()
  
  return (
    <div className="h-full w-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-6">
      <div className="px-4 mb-8 flex flex-col items-center">
        <ZhangAvatar mood="happy" size="lg" className="mb-3" />
        <h1 className="text-xl font-bold text-center">AI 作文批改系统</h1>
      </div>
      
      <nav className="space-y-2 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <ZhangCard 
              key={item.name}
              highlighted={isActive}
              withBubbles={isActive}
              className="p-0 overflow-hidden cursor-pointer"
            >
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors w-full ${
                  isActive 
                    ? 'text-primary dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                {item.name}
              </Link>
            </ZhangCard>
          )
        })}
      </nav>
    </div>
  )
} 