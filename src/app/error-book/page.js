"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import { 
  ZhangButton, 
  ZhangInput, 
  ZhangCard, 
  ZhangAvatar, 
  ZhangBubble 
} from "@/components/zhang"

/**
 * 错题本页面组件
 * 显示学生学习过程中的错误用法和改正方法
 * 使用章同学UI组件风格
 */
export default function ErrorBook() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  
  const [errors] = useState([
    {
      id: 1,
      original: "蓝蓝的天空",
      correction: "湛蓝的天空",
      reason: "用更丰富的词汇表达颜色深度",
      date: "2023-12-14",
      essay: "我的暑假生活"
    },
    {
      id: 2,
      original: "那感觉真是太棒了",
      correction: "那种成就感令人难以忘怀",
      reason: "避免口语化表达，使用更正式的书面语言",
      date: "2023-12-14",
      essay: "我的暑假生活"
    },
    {
      id: 3,
      original: "我们玩得很开心",
      correction: "我们尽情享受着欢乐的时光",
      reason: "使用更具体、生动的描述",
      date: "2023-12-10",
      essay: "难忘的一天"
    },
    {
      id: 4,
      original: "非常漂亮",
      correction: "美轮美奂",
      reason: "使用成语增加文采",
      date: "2023-12-05",
      essay: "家乡的变化"
    }
  ])

  const filteredErrors = errors.filter(error => 
    error.original.includes(searchTerm) || 
    error.correction.includes(searchTerm) ||
    error.reason.includes(searchTerm) ||
    error.essay.includes(searchTerm)
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800">我的错题本</h1>
      </div>

      <div className="flex flex-col space-y-6">
        {/* 搜索框 */}
        <div className="relative">
          <ZhangInput
            placeholder="搜索错题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* 错题列表 */}
        {filteredErrors.length > 0 ? (
          <div className="grid gap-4">
            {filteredErrors.map((error) => (
              <ZhangCard key={error.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <ZhangAvatar mood="thinking" size="sm" className="mr-3" />
                      <h3 className="font-medium">{error.essay}</h3>
                    </div>
                    <span className="text-xs text-gray-500">{error.date}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-red-500 font-medium">原文</p>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-700">{error.original}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-green-500 font-medium">改正</p>
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="text-sm text-green-700">{error.correction}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-blue-500 font-medium">解析</p>
                      <ZhangBubble variant="light" size="sm">
                        <p className="text-sm">{error.reason}</p>
                      </ZhangBubble>
                    </div>
                  </div>
                </div>
              </ZhangCard>
            ))}
          </div>
        ) : (
          <ZhangCard className="p-8 text-center">
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="thinking" size="lg" className="mb-4" />
              <ZhangBubble>
                <p className="text-gray-500">暂无错题记录</p>
                <p className="text-sm text-gray-400 mt-1">错题会在你提交作文后自动整理到这里</p>
              </ZhangBubble>
            </div>
          </ZhangCard>
        )}
      </div>
    </div>
  )
}