"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'

/**
 * 侧边导航组件
 * 在桌面/平板设备上显示的主导航栏
 */
export function SideNav() {
  const pathname = usePathname()
  
  return (
    <div className="h-full w-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pt-6">
      <div className="px-4 mb-8">
        <h1 className="text-xl font-bold text-center">AI 作文批改系统</h1>
      </div>
      
      <nav className="space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-primary dark:bg-gray-800 dark:text-white' 
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 