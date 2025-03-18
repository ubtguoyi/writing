import { Home, Book, Dumbbell, FileText } from 'lucide-react'

/**
 * 应用程序导航项配置
 * 包含导航标签名称、路由链接和对应图标
 */
export const NAV_ITEMS = [
  { name: '首页', href: '/', icon: Home },
  { name: '错题本', href: '/error-book', icon: Book },
  { name: '练习', href: '/exercise', icon: Dumbbell },
  { name: '批改记录', href: '/correction-records', icon: FileText },
]

/**
 * 年级映射表
 * 将年级代码转换为显示名称
 */
export const GRADE_MAP = {
  "primary1": "一年级",
  "primary2": "二年级",
  "primary3": "三年级",
  "primary4": "四年级",
  "primary5": "五年级",
  "primary6": "六年级"
} 