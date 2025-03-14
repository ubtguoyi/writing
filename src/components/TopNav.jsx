"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function TopNav() {
  const pathname = usePathname()
  
  const navItems = [
    { name: '首页', href: '/' },
    { name: '错题本', href: '/error-book' },
    { name: '练习', href: '/exercise' },
  ]
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-center h-14 px-4">
        <div className="flex w-full max-w-md justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-1 items-center justify-center text-sm font-medium transition-colors py-4 ${
                  isActive 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }`}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 h-0.5 w-1/2 bg-black dark:bg-white" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 