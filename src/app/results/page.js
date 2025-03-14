"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function Results() {
  const router = useRouter()
  const [essays] = useState([
    {
      id: 1,
      title: "我的暑假生活",
      grade: "初二",
      wordCount: 500,
      submittedAt: "2023-12-14 11:05:40",
      imageCount: 2
    }
  ])
  
  // Simulate progress
  const [progress, setProgress] = useState(30)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 5
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const handleViewReport = (id) => {
    router.push(`/report/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">批改结果</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>作文信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm">提交时间: {formatDate(essays[0].submittedAt)}</p>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm">作文题目: <span className="font-medium">{essays[0].title}</span></p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Badge variant="outline" className="justify-center">年级: {essays[0].grade}</Badge>
                <Badge variant="outline" className="justify-center">字数: {essays[0].wordCount}</Badge>
                <Badge variant="outline" className="justify-center">图片: {essays[0].imageCount}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>批改进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {progress < 100 ? (
                  <p className="text-lg mb-4">正在批改中，请稍候...</p>
                ) : (
                  <p className="text-lg text-green-600 mb-4">批改完成！</p>
                )}
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>分析中</span>
                <span>评分中</span>
                <span>润色中</span>
                <span>完成</span>
              </div>
              
              {progress < 100 && (
                <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  预计剩余时间: {Math.max(0, Math.round((100 - progress) / 5))} 秒
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                返回首页
              </Button>
              <Button 
                onClick={() => handleViewReport(essays[0].id)} 
                disabled={progress < 100}
              >
                查看报告
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 