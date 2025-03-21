import './globals.css'
import { Noto_Sans_SC } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNav } from '@/components/BottomNav'
import { SideNav } from '@/components/SideNav'

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: true,
  subsets: ['latin'],
})

export const metadata = {
  title: 'AI 作文批改',
  description: '基于AI的智能作文批改系统，提供即时反馈和改进建议',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        notoSansSC.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex">
            {/* SideNav - hidden on mobile, visible on desktop */}
            <div className="hidden md:block md:w-64 md:fixed md:inset-y-0 md:z-50">
              <SideNav />
            </div>
            
            {/* Main content */}
            <main className="flex-1 pb-16 md:pb-0 md:pl-64">
              {children}
            </main>
          </div>
          
          {/* Show BottomNav only on mobile, hidden on desktop */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
