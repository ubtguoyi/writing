"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Sparkles, BookOpen, FileText, PenLine, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

/**
 * 主页组件
 * 提供作文提交和批改功能的主界面
 */
export default function Home() {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitProgress, setSubmitProgress] = useState("")
  const [apiResponse, setApiResponse] = useState(null)
  
  // Clear all localStorage items except correctionRecords when component mounts
  useEffect(() => {
    // Get the correctionRecords data first
    const correctionRecords = localStorage.getItem('correctionRecords');
    
    // Clear all localStorage items
    localStorage.clear();
    
    // Restore correctionRecords if it existed
    if (correctionRecords) {
      localStorage.setItem('correctionRecords', correctionRecords);
    }
    
    console.log("清除了所有不必要的存储数据，只保留了批改记录");
  }, []);
  
  // 初始化表单控制器
  const form = useForm({
    defaultValues: {
      grade: "",
      wordCount: "",
      title: ""
    }
  })

  /**
   * 处理图片上传
   * @param {Event} e - 文件选择事件
   */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setIsUploading(true)
      
      try {
        // 处理每个文件并立即上传
        const uploadedImages = []
        
        for (const file of files) {
          // 创建预览
          const preview = URL.createObjectURL(file)
          
          // 创建图片上传的表单数据
          const imageFormData = new FormData()
          imageFormData.append('file', file)
          imageFormData.append('user', 'abc')
          
          // 上传图片
          const uploadResponse = await fetch('https://llm.ubtrobot.com/v1/files/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer app-ILbJeMTBKKxhcbjZ0sewOkOJ',
            },
            body: imageFormData
          })
          
          if (!uploadResponse.ok) {
            throw new Error('图片上传失败')
          }
          
          const uploadResult = await uploadResponse.json()
          
          // 存储图片数据及返回的ID
          uploadedImages.push({
            file,
            preview,
            id: uploadResult.id,
            text: uploadResult.text || ""
          })
        }
        
        // 将上传的图片添加到状态中
        setImages(prev => [...prev, ...uploadedImages])
      } catch (error) {
        console.error("图片上传错误:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  /**
   * 移除已上传的图片
   * @param {number} index - 要移除的图片索引
   */
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  /**
   * 处理表单提交
   * @param {Object} formValues - 表单的字段值
   */
  const onSubmit = async (formValues) => {
    setIsSubmitting(true)
    
    try {
      const { grade, wordCount, title } = formValues
      
      // Create form data but don't store it in localStorage
      const formData = {
        title,
        grade,
        wordCount,
        imageCount: images.length,
        submittedAt: new Date().toISOString()
      }
      
      // 从本地存储获取现有记录或初始化空数组
      const existingRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]')
      
      // 创建新记录并设置加载状态
      const newRecord = {
        id: Date.now(), // 使用时间戳作为临时ID
        ...formData,
        status: "processing"
      }
      
      // 将新记录添加到列表开头
      const updatedRecords = [newRecord, ...existingRecords]
      localStorage.setItem('correctionRecords', JSON.stringify(updatedRecords))
      
      // 导航到批改记录页面
      router.push("/correction-records")
      
      // 继续在后台处理
      if (images.length > 0) {
        setSubmitProgress("正在处理作文...")
        
        // 使用第一张图片的文本和ID进行工作流API调用
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer app-ILbJeMTBKKxhcbjZ0sewOkOJ");
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "inputs": {
            "images": {
              "type": "image",
              "transfer_method": "local_file",
              "upload_file_id": images[0].id
            }
          },
          "response_mode": "blocking",
          "user": "abc"
        });

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw
        };

        const workflowResponse = await fetch("https://llm.ubtrobot.com/v1/workflows/run", requestOptions);
        
        if (!workflowResponse.ok) {
          throw new Error('工作流API调用失败');
        }
        
        const workflowResult = await workflowResponse.json();
        setApiResponse(workflowResult);
        
        // 从工作流响应中提取原始文本
        const extractedText = workflowResult.data.outputs.text || "";
        console.log("原始文本:", extractedText);

        // 进行第二次API调用以获取批改结果
        const correctionHeaders = new Headers();
        correctionHeaders.append("Authorization", "Bearer app-8D9vfdkoqQBmAkF5RcONcjMC");
        correctionHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        correctionHeaders.append("Content-Type", "application/json");

        const correctionBody = JSON.stringify({
          "inputs": {
            "orign_text": extractedText,
            "require_word_count": wordCount,
            "require_theme": title || "无"
          },
          "response_mode": "blocking",
          "user": "abc"
        });

        const correctionOptions = {
          method: 'POST',
          headers: correctionHeaders,
          body: correctionBody
        };

        // 进行批改API调用
        setSubmitProgress("正在获取批改结果...");
        const correctionResponse = await fetch("https://llm.ubtrobot.com/v1/workflows/run", correctionOptions);
        
        if (!correctionResponse.ok) {
          throw new Error('批改API调用失败');
        }
        
        const correctionResult = await correctionResponse.json();
        console.log("批改API响应:", correctionResult);
        
        // 在获取到结果后立即更新状态为"已完成"
        const recordsToUpdate = JSON.parse(localStorage.getItem('correctionRecords') || '[]');
        const recordIdx = recordsToUpdate.findIndex(r => r.id === newRecord.id);
        if (recordIdx !== -1) {
          recordsToUpdate[recordIdx].status = "completed";
          localStorage.setItem('correctionRecords', JSON.stringify(recordsToUpdate));
          console.log("状态已更新为完成");
        } else {
          console.error("未找到记录ID:", newRecord.id);
        }

        setIsSubmitting(false)
        
        // 更新记录状态为完成并添加工作流结果
        const updatedRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]')
        const recordIndex = updatedRecords.findIndex(r => r.id === newRecord.id)
        if (recordIndex !== -1) {
          updatedRecords[recordIndex].status = "completed";
          updatedRecords[recordIndex].originalText = extractedText;
          updatedRecords[recordIndex].workflowResult = workflowResult;
          updatedRecords[recordIndex].correctionResult = correctionResult;
          // 在记录中存储API输出以供报告显示
          if (correctionResult.data && correctionResult.data.outputs) {
            updatedRecords[recordIndex].outputResults = correctionResult.data.outputs;
          } else if (correctionResult.outputs) {
            updatedRecords[recordIndex].outputResults = correctionResult.outputs;
          }
          localStorage.setItem('correctionRecords', JSON.stringify(updatedRecords))
        }
      }
    } catch (error) {
      console.error("提交错误:", error);
      
      // 更新记录状态为错误
      const updatedRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]')
      const recordIndex = updatedRecords.findIndex(r => r.id === newRecord.id)
      if (recordIndex !== -1) {
        updatedRecords[recordIndex].status = "error"
        updatedRecords[recordIndex].error = error.message
        localStorage.setItem('correctionRecords', JSON.stringify(updatedRecords))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // 功能数据
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
      icon: BookOpen,
      title: "改进建议",
      description: "提供具体的改进建议和范文参考"
    },
    {
      icon: Sparkles,
      title: "AI 批改",
      description: "使用先进的AI技术进行智能批改"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI 作文批改系统</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>提交作文</CardTitle>
              <CardDescription>
                上传作文图片，填写相关信息，开始智能批改
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年级</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择年级" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="primary1">一年级</SelectItem>
                            <SelectItem value="primary2">二年级</SelectItem>
                            <SelectItem value="primary3">三年级</SelectItem>
                            <SelectItem value="primary4">四年级</SelectItem>
                            <SelectItem value="primary5">五年级</SelectItem>
                            <SelectItem value="primary6">六年级</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wordCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>字数要求</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="请输入字数要求" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>批改要求</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="请输入批改要求" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>上传作文图片</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.preview}
                            alt={`作文图片 ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {images.length < 4 && (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            multiple
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                <span className="mt-2 text-sm text-gray-500">
                                  正在上传...
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">
                                  点击上传图片
                                </span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || images.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {submitProgress}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        提交批改
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>功能特点</CardTitle>
              <CardDescription>
                了解我们的智能批改系统的主要功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
