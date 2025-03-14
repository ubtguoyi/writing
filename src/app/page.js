"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Sparkles, BookOpen, FileText, PenLine, X, Upload } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function Home() {
  const router = useRouter()
  const [grade, setGrade] = useState("")
  const [wordCount, setWordCount] = useState("")
  const [title, setTitle] = useState("")
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate to results page
      router.push("/results")
    }, 1500)
  }

  const resetForm = () => {
    setGrade("")
    setWordCount("")
    setTitle("")
    setImages([])
  }

  // Feature data
  const features = [
    {
      icon: FileText,
      title: "智能评分",
      description: "根据标准评分标准，给出专业评分和反馈"
    },
    {
      icon: PenLine,
      title: "指出错误",
      description: "标注语法、用词、标点等各方面错误"
    },
    {
      icon: Sparkles,
      title: "提供改进",
      description: "给出详细的改进建议和优化方案"
    },
    {
      icon: BookOpen,
      title: "成长追踪",
      description: "记录学习历程，追踪写作能力提升"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">AI 作文批改系统</h1>
        <p className="text-xl text-muted-foreground">智能批改，快速提升写作能力</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">开始批改</CardTitle>
              <CardDescription>上传你的作文，获得智能批改和反馈</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">年级选择</Label>
                    <Select value={grade} onValueChange={setGrade} required>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="选择年级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary1">一年级</SelectItem>
                        <SelectItem value="primary2">二年级</SelectItem>
                        <SelectItem value="primary3">三年级</SelectItem>
                        <SelectItem value="primary4">四年级</SelectItem>
                        <SelectItem value="primary5">五年级</SelectItem>
                        <SelectItem value="primary6">六年级</SelectItem>
                        <SelectItem value="junior1">初一</SelectItem>
                        <SelectItem value="junior2">初二</SelectItem>
                        <SelectItem value="junior3">初三</SelectItem>
                        <SelectItem value="high1">高一</SelectItem>
                        <SelectItem value="high2">高二</SelectItem>
                        <SelectItem value="high3">高三</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="wordCount">字数要求</Label>
                    <Input 
                      id="wordCount"
                      type="number" 
                      placeholder="输入字数要求" 
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      min="1"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="title">作文标题</Label>
                    <Input 
                      id="title"
                      placeholder="输入作文标题" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>上传作文图片</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">点击上传或拖拽文件到此处</p>
                      <p className="text-xs text-muted-foreground mb-4">支持PNG、JPG格式</p>
                      <input
                        type="file"
                        id="picture"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('picture').click()}
                        type="button"
                      >
                        选择文件
                      </Button>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    <Label>已上传图片 ({images.length})</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden group">
                          <img 
                            src={image.preview} 
                            alt={`上传的图片 ${index + 1}`}
                            className="h-24 w-full object-cover" 
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  重置
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !grade || !title || images.length === 0}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      <span>提交中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" /> 提交作文
                    </div>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
