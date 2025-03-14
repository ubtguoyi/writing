"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

export default function Exercise() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  
  const handleSubmit = () => {
    if (!content.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/results")
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">写作练习</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">看图写话</h2>
        <div className="mb-4">
          <img 
            src="/exercise-image.jpg" 
            alt="练习图片"
            className="w-full h-48 object-cover rounded-lg mb-4"
            style={{ background: "#f0f0f0" }}
          />
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">要求：</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>根据图片内容，写一篇不少于300字的作文</li>
            <li>注意描写人物的动作、表情和心理活动</li>
            <li>可以发挥想象，但要紧扣图片主题</li>
            <li>注意文章的结构和语言表达</li>
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setActiveTab("write")}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
              activeTab === "write" 
                ? "bg-white dark:bg-gray-800 text-primary border-b-2 border-primary" 
                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            写作区
          </button>
          <button 
            onClick={() => setActiveTab("reference")}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
              activeTab === "reference" 
                ? "bg-white dark:bg-gray-800 text-primary border-b-2 border-primary" 
                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            参考素材
          </button>
        </div>
        
        {activeTab === "write" && (
          <div className="p-4">
            <div className="mb-4">
              <textarea
                placeholder="请在此处开始你的写作..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[300px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
              <div className="text-right mt-2 text-xs text-gray-500 dark:text-gray-400">
                已写 {content.length} 字
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className={`flex items-center px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                  isSubmitting || !content.trim() 
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isSubmitting ? (
                  <>提交中...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> 提交作文</>
                )}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === "reference" && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">常用词汇</h3>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">表情描写：</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">喜笑颜开、眉开眼笑、愁眉苦脸、目瞪口呆</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">动作描写：</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">健步如飞、蹑手蹑脚、手舞足蹈、大步流星</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">心理描写：</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">忐忑不安、心花怒放、心急如焚、忧心忡忡</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">环境描写：</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">鸟语花香、万籁俱寂、热闹非凡、宁静祥和</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">写作技巧</h3>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">1. 开头点题：</span> <span className="text-gray-600 dark:text-gray-400">开篇点明主题，引起读者兴趣。</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">2. 中间展开：</span> <span className="text-gray-600 dark:text-gray-400">按照时间顺序或空间顺序展开叙述。</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">3. 细节描写：</span> <span className="text-gray-600 dark:text-gray-400">通过细节描写使文章生动具体。</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">4. 结尾升华：</span> <span className="text-gray-600 dark:text-gray-400">总结全文，升华主题。</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 