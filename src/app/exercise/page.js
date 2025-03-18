"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X, Heart } from "lucide-react"

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
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    if (answer === currentQuestion.blank.correctAnswer) {
      // 答对了
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer("")
          setShowFeedback(false)
        } else {
          router.push("/results")
        }
      }, 1500)
    } else {
      // 答错了
      setLives(prev => prev - 1)
      if (lives <= 1) {
        setTimeout(() => {
          router.push("/results")
        }, 1500)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer("")
      setShowFeedback(false)
    } else {
      router.push("/results")
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold">词语练习</h1>
        </div>
        <div className="flex items-center space-x-2">
          {[...Array(lives)].map((_, i) => (
            <Heart key={i} className="w-6 h-6 text-red-500 fill-current" />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
        <div className="mb-4">
          <img 
            src={currentQuestion.image} 
            alt="练习图片"
            className="w-full h-48 object-cover rounded-lg mb-4"
            style={{ background: "#f0f0f0" }}
          />
        </div>
        
        <div className="text-center mb-6">
          <p className="text-xl">
            {currentQuestion.text.split("").map((char, index) => (
              <span key={index}>
                {index === currentQuestion.blank.position ? (
                  <span className="inline-block w-20 h-8 border-b-2 border-primary mx-1">
                    {selectedAnswer}
                  </span>
                ) : (
                  char
                )}
              </span>
            ))}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showFeedback && handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`p-4 rounded-lg text-center transition-colors ${
                showFeedback
                  ? option === currentQuestion.blank.correctAnswer
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : option === selectedAnswer
                    ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-lg mb-6 ${
            selectedAnswer === currentQuestion.blank.correctAnswer
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}>
            {selectedAnswer === currentQuestion.blank.correctAnswer ? (
              <div className="flex items-center justify-center">
                <Check className="w-6 h-6 mr-2" />
                <span>回答正确！</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <X className="w-6 h-6 mr-2" />
                <span>回答错误</span>
              </div>
            )}
            <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            第 {currentQuestionIndex + 1}/{questions.length} 题
          </div>
          {showFeedback && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? "下一题" : "完成"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 