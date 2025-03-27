"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { 
  ZhangButton, 
  ZhangCard,
  ZhangTextarea
} from "@/components/zhang"
import { parseAndStoreStoryData } from "@/utils/storyDataParser"

export default function ParseDataPage() {
  const router = useRouter()
  const [inputData, setInputData] = useState("")
  const [status, setStatus] = useState({ success: false, message: "" })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = () => {
    if (!inputData.trim()) {
      setStatus({
        success: false,
        message: "请输入有效的JSON数据"
      })
      return
    }

    setIsProcessing(true)
    setStatus({ success: false, message: "正在处理数据..." })

    try {
      // 使用工具函数解析数据
      const parsedQuestions = parseAndStoreStoryData(inputData)
      
      if (parsedQuestions && parsedQuestions.length > 0) {
        setStatus({
          success: true,
          message: `成功解析并存储了${parsedQuestions.length}个问题！`
        })
      } else {
        setStatus({
          success: false,
          message: "解析数据失败，请检查JSON格式"
        })
      }
    } catch (error) {
      console.error('解析数据时出错:', error)
      setStatus({
        success: false,
        message: `解析失败: ${error.message}`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTestData = () => {
    // 设置测试数据
    const exampleData = {
      "code": 0,
      "cost": "0",
      "data": "{\"output\":[{\"img\":\"https://s.coze.cn/t/fywy4IEMUVI/\",\"question\":\"今天，章同学在校园里发现了一张神秘的（），地图上标注着一个隐藏的宝藏。好奇心驱使他决定去探险。他带上书包，悄悄溜出了教室，开始了他的冒险之旅。\",\"selection_list\":[{\"answer\":\"你真棒！\",\"selection\":\"地图\"},{\"answer\":\"很遗憾~书籍与上下文内容不相关，无法描述发现宝藏的情境。\",\"selection\":\"书籍\"},{\"answer\":\"很遗憾~照片与上下文内容不相关，无法描述发现宝藏的情境。\",\"selection\":\"照片\"},{\"answer\":\"很遗憾~信件与上下文内容不相关，无法描述发现宝藏的情境。\",\"selection\":\"信件\"}]},{\"img\":\"https://s.coze.cn/t/WgE0HBk-d0U/\",\"question\":\"章同学首先来到了学校的后花园，这里花草茂盛，阳光透过树叶洒在地上，形成（    ）的光影。他小心翼翼地穿过花园，突然，一只蝴蝶飞过，翅膀上闪烁着五彩斑斓的光芒。章同学被这美丽的景象吸引，暂时忘记了地图上的标记。\",\"selection_list\":[{\"answer\":\"你真棒！\",\"selection\":\"斑驳\"},{\"answer\":\"很遗憾~+错误原因：'明亮'通常用于形容光线充足，与文中描述的斑驳光影不符。\",\"selection\":\"明亮\"},{\"answer\":\"很遗憾~+错误原因：'暗淡'通常用于形容光线不足，与文中描述的斑驳光影不符。\",\"selection\":\"暗淡\"},{\"answer\":\"很遗憾~+错误原因：'均匀'通常用于形容分布均匀，与文中描述的斑驳光影不符。\",\"selection\":\"均匀\"}]}],\"title\":\"章同学的校园冒险\"}",
      "debug_url": "https://www.coze.cn/work_flow?execute_id=7486372376550555648\u0026space_id=7403639930154680330\u0026workflow_id=7486361244284108839\u0026execute_mode=2",
      "msg": "Success",
      "token": 8471
    }
    
    setInputData(JSON.stringify(exampleData, null, 2))
  }

  const handleGoToWordPractice = () => {
    router.push("/exercise/word-practice")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/exercise")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800 zhang-text">解析故事数据</h1>
      </div>
      
      <div className="space-y-6">
        <ZhangCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 zhang-text">输入JSON数据</h2>
          <p className="text-gray-600 mb-4 zhang-text">
            请将API返回的JSON数据粘贴到下方文本框中，点击"解析数据"按钮进行处理。
          </p>
          
          <div className="mb-4">
            <ZhangButton 
              variant="outline" 
              size="sm" 
              onClick={handleTestData}
              className="mb-2"
            >
              填充示例数据
            </ZhangButton>
            
            <ZhangTextarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='{"code": 0, "data": "..."}'
              className="h-64 font-mono text-sm"
            />
          </div>
          
          <div className="flex space-x-4">
            <ZhangButton 
              onClick={handleSubmit}
              disabled={isProcessing || !inputData.trim()}
            >
              {isProcessing ? "处理中..." : "解析数据"}
            </ZhangButton>
            
            {status.success && (
              <ZhangButton 
                variant="outline"
                onClick={handleGoToWordPractice}
              >
                去练习
              </ZhangButton>
            )}
          </div>
          
          {status.message && (
            <div className={`mt-4 p-3 rounded-md ${
              status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.message}
            </div>
          )}
        </ZhangCard>
        
        <ZhangCard className="p-6">
          <h2 className="text-xl font-semibold mb-2 zhang-text">使用说明</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 zhang-text">
            <li>本工具用于解析故事练习的JSON数据</li>
            <li>将从Coze API获取的原始JSON响应粘贴到上方文本框</li>
            <li>点击"解析数据"按钮，系统会自动处理并存储</li>
            <li>处理成功后，可以点击"去练习"按钮直接前往词语练习页面</li>
            <li>也可以返回练习主页选择其他练习类型</li>
          </ul>
        </ZhangCard>
      </div>
    </div>
  )
} 