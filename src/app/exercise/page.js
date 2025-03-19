"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X, Heart } from "lucide-react"
import { 
  ZhangButton, 
  ZhangCard, 
  ZhangAvatar, 
  ZhangBubble 
} from "@/components/zhang"
import Image from "next/image"

/**
 * 练习页面组件
 * 提供词汇、语法等学习练习题
 * 使用章同学UI组件风格
 */

// 模拟题目数据
const questions = [
  {
    id: 1,
    image: "/exercise-image-1.jpg",
    text: "小明在公园里_____地奔跑。",
    blank: {
      position: 4,
      correctAnswer: "欢快"
    },
    options: ["欢快", "悲伤", "缓慢", "美丽", "开心"],
    explanation: "欢快：表示愉快、高兴的样子，符合图中奔跑的状态"
  },
  {
    id: 2,
    image: "/exercise-image-2.jpg",
    text: "他_____地笑着，看起来很开心。",
    blank: {
      position: 2,
      correctAnswer: "灿烂"
    },
    options: ["灿烂", "悲伤", "生气", "害羞", "温柔"],
    explanation: "灿烂：形容笑容明亮、愉快，与图中表情相符"
  }
]

export default function Exercise() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [lives, setLives] = useState(3)
  
  const currentQuestion = questions[currentQuestionIndex]
  
  const handleAnswerSelect = (answer) => {
    if (showFeedback) return
    setSelectedAnswer(answer)
  }
  
  const handleCheck = () => {
    if (!selectedAnswer) return
    setShowFeedback(true)
    
    if (selectedAnswer !== currentQuestion.blank.correctAnswer) {
      setLives(lives - 1)
    }
  }
  
  const isCorrect = selectedAnswer === currentQuestion.blank.correctAnswer
  
  const getZhangMood = () => {
    if (!showFeedback) return "thinking"
    return isCorrect ? "happy" : "sad"
  }
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
      setShowFeedback(false)
    } else {
      // 练习完成
      router.push("/")
    }
  }
  
  const handleRetry = () => {
    setLives(3)
    setCurrentQuestionIndex(0)
    setSelectedAnswer("")
    setShowFeedback(false)
  }
  
  // 当没有生命值时游戏结束
  if (lives === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </ZhangButton>
          <h1 className="text-3xl font-bold text-gray-800">词汇练习</h1>
        </div>
        
        <ZhangCard className="p-8 text-center">
          <div className="flex flex-col items-center">
            <ZhangAvatar mood="sad" size="lg" className="mb-4" />
            <ZhangBubble>
              <h3 className="text-xl font-bold mb-2">游戏结束</h3>
              <p className="text-gray-600 mb-6">你已经用完了所有生命值</p>
              <ZhangButton onClick={handleRetry} className="mt-2">
                重新开始
              </ZhangButton>
            </ZhangBubble>
          </div>
        </ZhangCard>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800">词汇练习</h1>
        
        <div className="ml-auto flex items-center">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
      
      <ZhangCard>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <ZhangAvatar mood={getZhangMood()} size="md" className="mr-3" />
            <div>
              <h3 className="text-lg font-medium">题目 {currentQuestionIndex + 1}/{questions.length}</h3>
              <p className="text-sm text-gray-500">选择最合适的词语填入句子空白处</p>
            </div>
          </div>
          
          {currentQuestion.image && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={currentQuestion.image}
                  alt="题目图片"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <p className="text-lg text-center mb-6">{currentQuestion.text}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentQuestion.options.map((option) => (
                <ZhangButton
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    ${showFeedback && option === currentQuestion.blank.correctAnswer ? "bg-green-100 border-green-500 text-green-700" : ""}
                    ${showFeedback && option === selectedAnswer && option !== currentQuestion.blank.correctAnswer ? "bg-red-100 border-red-500 text-red-700" : ""}
                  `}
                  disabled={showFeedback}
                >
                  {option}
                </ZhangButton>
              ))}
            </div>
          </div>
          
          {showFeedback ? (
            <div className="space-y-4">
              <ZhangBubble>
                <div className="flex items-start">
                  {isCorrect ? (
                    <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="text-red-500 w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "回答正确！" : "回答错误"}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </ZhangBubble>
              
              <div className="flex justify-end">
                <ZhangButton onClick={handleNext}>
                  {currentQuestionIndex < questions.length - 1 ? "下一题" : "完成练习"}
                </ZhangButton>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <ZhangButton 
                onClick={handleCheck} 
                disabled={!selectedAnswer}
                className={!selectedAnswer ? "opacity-50 cursor-not-allowed" : ""}
              >
                检查答案
              </ZhangButton>
            </div>
          )}
        </div>
      </ZhangCard>
    </div>
  )
} 