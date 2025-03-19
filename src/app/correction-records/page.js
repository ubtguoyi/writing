"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  AlignLeft, 
  Image as ImageIcon,
  Eye,
  Loader2,
  RefreshCw
} from "lucide-react"
import { 
  ZhangButton, 
  ZhangCard, 
  ZhangAvatar, 
  ZhangBubble 
} from "@/components/zhang"
import { Badge } from "@/components/ui/badge"
import { GRADE_MAP } from "@/lib/constants"

/**
 * 批改记录页面组件
 * 显示用户提交的所有作文批改记录列表
 * 使用章同学UI组件风格
 */
export default function CorrectionRecords() {
  const router = useRouter()
  const [records, setRecords] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // 从localStorage加载记录
  const loadRecordsFromStorage = () => {
    const storedRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]')
    setRecords(storedRecords)
  }
  
  useEffect(() => {
    // 初始加载记录
    loadRecordsFromStorage()
    
    // 设置定时器每2秒检查一次更新
    const intervalId = setInterval(() => {
      loadRecordsFromStorage()
    }, 2000)
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId)
  }, [])
  
  // 手动刷新记录
  const handleRefresh = () => {
    setIsRefreshing(true)
    loadRecordsFromStorage()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  /**
   * 格式化日期字符串为易读格式
   * @param {string} dateString - ISO格式的日期字符串
   * @returns {string} 格式化后的日期字符串
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  /**
   * 将年级代码转换为显示名称
   * @param {string} gradeValue - 年级代码
   * @returns {string} 年级的中文显示名称
   */
  const getGradeDisplayName = (gradeValue) => {
    return GRADE_MAP[gradeValue] || gradeValue
  }

  /**
   * 获取要求文本，当标题为空时显示占位符
   * @param {string} title - 标题文本
   * @returns {string} 处理后的要求文本
   */
  const getRequirementText = (title) => {
    return title && title.trim() ? title : "无";
  };

  /**
   * 处理查看报告的点击事件
   * @param {number|string} id - 记录ID
   */
  const handleViewReport = (id) => {
    router.push(`/report/${id}`)
  }

  /**
   * 根据状态生成对应的状态徽章
   * @param {string} status - 记录状态
   * @returns {JSX.Element} 状态徽章组件
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            处理中
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            批改完成
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            处理失败
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            未知状态
          </Badge>
        )
    }
  }

  // 根据状态获取章同学的表情
  const getZhangMood = (status) => {
    switch (status) {
      case "processing":
        return "thinking"
      case "completed":
        return "happy"
      case "error":
        return "sad"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800">批改记录</h1>
        <ZhangButton 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="ml-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新
        </ZhangButton>
      </div>

      <div className="grid gap-6">
        {records.length > 0 ? (
          records.map((record) => (
            <ZhangCard 
              key={record.id} 
              highlighted={record.status === "completed"}
              withBubbles={record.status === "completed"}
              className="overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-12">
                <div className="md:col-span-4 bg-blue-50 p-6">
                  <div className="flex items-center mb-3">
                    <ZhangAvatar 
                      mood={getZhangMood(record.status)} 
                      size="md" 
                      className="mr-3" 
                    />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {getGradeDisplayName(record.grade)}
                    </h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(record.submittedAt)}
                  </div>
                </div>
                
                <div className="md:col-span-6 p-6 bg-white space-y-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <FileText className="h-5 w-5 mr-3 text-blue-600" />
                    <span>字数要求: <span className="font-medium">{record.wordCount || "0"}</span></span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <AlignLeft className="h-5 w-5 mr-3 text-blue-600" />
                    <span>批改要求: <span className="font-medium">{getRequirementText(record.title)}</span></span>
                  </div>
                  
                  {record.imageCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <ImageIcon className="h-4 w-4 mr-1.5" />
                        图片: {record.imageCount}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    {getStatusBadge(record.status)}
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-center justify-center p-6 bg-gray-50 border-l">
                  <ZhangButton 
                    onClick={() => handleViewReport(record.id)} 
                    disabled={record.status !== "completed"}
                    className={`w-full ${
                      record.status !== "completed" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    查看报告
                  </ZhangButton>
                </div>
              </div>
            </ZhangCard>
          ))
        ) : (
          <ZhangCard className="p-8 text-center">
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="thinking" size="lg" className="mb-4" />
              <ZhangBubble>
                <p className="text-gray-500">暂无批改记录</p>
              </ZhangBubble>
            </div>
          </ZhangCard>
        )}
      </div>
    </div>
  )
} 