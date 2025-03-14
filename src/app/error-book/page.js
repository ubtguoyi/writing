"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, BookOpen } from "lucide-react"

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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push("/")}
          className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">错题本</h1>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索错题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">常见错误 ({filteredErrors.length})</h2>
          </div>
          
          {filteredErrors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">没有找到相关错题</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">尝试使用其他关键词搜索</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredErrors.map((error) => (
                <div key={error.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="mb-2">
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-1.5">
                      <span className="font-medium text-gray-500 dark:text-gray-400 mr-1">原文:</span> 
                      {error.original}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-1.5">
                      <span className="font-medium text-green-600 dark:text-green-400 mr-1">修改:</span> 
                      {error.correction}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium text-blue-600 dark:text-blue-400 mr-1">原因:</span> 
                      {error.reason}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <p>来自: {error.essay}</p>
                    <p>日期: {error.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}