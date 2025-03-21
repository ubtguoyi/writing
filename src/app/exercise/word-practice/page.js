"use client"

import { useState, useEffect } from "react"
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
 * 错词练习页面组件
 * 提供词汇、语法等学习练习题
 * 使用章同学UI组件风格
 */

// 将解析后的问题转换为练习所需格式
const convertToQuestionFormat = (parsedQuestions) => {
  return parsedQuestions
    .filter(item => item.parsedQuestion && !item.error)
    .map((item, index) => {
      const { parsedQuestion } = item;
      // 提取问题和选项列表
      const questionText = parsedQuestion.question || "";
      const selectionList = parsedQuestion.selection_list || [];
      
      // 找出正确答案（通常是第一个选项，带有"你真棒"等正面评价的选项）
      const correctIndex = 0; // 默认第一个选项是正确答案
      const correctOption = selectionList[correctIndex]?.selection || "";
      
      return {
        id: index + 1,
        image: "", // 暂时为空
        text: questionText,
        options: selectionList.map(option => option.selection),
        selectionFeedback: selectionList.reduce((acc, option) => {
          acc[option.selection] = option.answer || "";
          return acc;
        }, {}),
        blank: {
          position: 0, // 不再需要位置
          correctAnswer: correctOption, // 使用选定的正确答案
          correctIndex // 保存正确答案的索引
        }
      };
    });
};

export default function WordPractice() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [lives, setLives] = useState(3)
  const [questions, setQuestions] = useState([])
  const [parsedStoryQuestions, setParsedStoryQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 从localStorage获取storyQuestions数据并解析
  useEffect(() => {
    const fetchStoryQuestions = () => {
      try {
        // 从localStorage获取storyQuestions
        const storyQuestionsStr = localStorage.getItem('storyQuestions')
        
        if (storyQuestionsStr) {
          // 解析storyQuestions JSON数组
          const storyQuestions = JSON.parse(storyQuestionsStr)
          
          // 解析每一项中的question字段
          const parsedQuestions = storyQuestions.map((item, index) => {
            try {
              if (!item.question) return { ...item, parsedQuestion: null, error: 'No question field' }
              
              // 检查并去除可能的多余转义
              let questionString = item.question
              
              // 解析question字段中的JSON
              const parsedQuestion = JSON.parse(questionString)
              
              console.log(`Successfully parsed question ${index}:`, parsedQuestion)
              
              return {
                ...item,
                parsedQuestion,
                error: null
              }
            } catch (error) {
              console.error(`Error parsing question ${index}:`, error, item.question)
              return {
                ...item,
                parsedQuestion: null,
                error: error.message
              }
            }
          })
          
          setParsedStoryQuestions(parsedQuestions)
          console.log('Parsed story questions:', parsedQuestions)
          
          // 将解析后的数据转换为题目格式并直接设置为questions
          const formattedQuestions = convertToQuestionFormat(parsedQuestions);
          if (formattedQuestions.length > 0) {
            setQuestions(formattedQuestions);
          } else {
            console.log('No valid questions found after parsing');
            setQuestions([]);
          }
        } else {
          console.log('No storyQuestions found in localStorage');
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching story questions:', error)
        setQuestions([]);
      } finally {
        setLoading(false)
      }
    }
    
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      fetchStoryQuestions()
    }
  }, [])
  
  const currentQuestion = questions[currentQuestionIndex]
  
  const handleAnswerSelect = (answer) => {
    if (showFeedback) return
    setSelectedAnswer(answer)
  }
  
  const handleCheck = () => {
    if (!selectedAnswer) return
    setShowFeedback(true)
    
    // 如果选择的不是正确答案，减少生命值
    if (selectedAnswer !== currentQuestion.blank.correctAnswer) {
      setLives(lives - 1)
    }
  }
  
  // 根据新的数据结构确定是否答案正确
  const isCorrect = selectedAnswer === currentQuestion?.blank?.correctAnswer
  
  // 获取章同学的情绪
  const getZhangMood = () => {
    if (!showFeedback) return "thinking"
    return isCorrect ? "happy" : "sad"
  }
  
  // 获取选择后的反馈内容
  const getFeedbackContent = () => {
    if (!showFeedback || !selectedAnswer) return null;
    
    // 如果有针对选项的反馈内容，则使用
    if (currentQuestion.selectionFeedback && currentQuestion.selectionFeedback[selectedAnswer]) {
      return currentQuestion.selectionFeedback[selectedAnswer];
    }
    
    // 如果没有反馈内容，返回默认反馈
    return isCorrect 
      ? "回答正确！" 
      : `回答错误，正确答案是: ${currentQuestion.blank.correctAnswer}`;
  }
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
      setShowFeedback(false)
    } else {
      // 练习完成，显示完成页面而不是直接跳转
      setCurrentQuestionIndex(questions.length) // 设置成超出索引范围的值来表示完成
    }
  }
  
  const handleRetry = () => {
    setLives(3)
    setCurrentQuestionIndex(0)
    setSelectedAnswer("")
    setShowFeedback(false)
  }
  
  // 显示解析后的storyQuestions数据
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/exercise")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </ZhangButton>
          <h1 className="text-3xl font-bold text-gray-800">错词练习</h1>
        </div>
        <ZhangCard className="p-8">
          <p className="text-center">正在加载题目数据...</p>
        </ZhangCard>
      </div>
    )
  }
  
  // 当没有生命值时游戏结束
  if (lives === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/exercise")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </ZhangButton>
          <h1 className="text-3xl font-bold text-gray-800">错词练习</h1>
        </div>
        
        <ZhangCard className="p-8 text-center">
          <div className="flex flex-col items-center">
            <ZhangAvatar mood="sad" size="lg" className="mb-4" />
            <ZhangBubble>
              <h3 className="text-xl font-bold mb-2">游戏结束</h3>
              <p className="text-gray-600 mb-4">别灰心！学习是一个持续进步的过程</p>
              <p className="text-gray-500 mb-6">你已经完成了 {currentQuestionIndex} 道题目，再接再厉！</p>
              <div className="flex justify-center space-x-4">
                <ZhangButton variant="outline" onClick={() => router.push("/exercise")} className="mt-2">
                  返回首页
                </ZhangButton>
                <ZhangButton onClick={handleRetry} className="mt-2">
                  重新开始
                </ZhangButton>
              </div>
            </ZhangBubble>
          </div>
        </ZhangCard>
      </div>
    )
  }
  
  // 当完成所有题目时显示恭喜页面
  if (currentQuestionIndex >= questions.length) {
    // 计算正确回答的题目数量
    const correctAnswers = questions.length - (3 - lives);
    const percentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">错词练习</h1>
        </div>
        
        <ZhangCard className="p-8 text-center">
          <div className="flex flex-col items-center">
            <ZhangAvatar mood="happy" size="lg" className="mb-4" />
            <ZhangBubble>
              <h3 className="text-xl font-bold mb-2">恭喜完成！</h3>
              <p className="text-gray-600 mb-3">你太棒了！成功完成了所有的练习题</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                {questions.length > 0 ? (
                  <>
                    <p className="text-gray-700">
                      正确率: <span className="font-bold text-blue-600">{percentage}%</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      共 {questions.length} 题，答对 {correctAnswers} 题
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">暂无题目</p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <ZhangButton variant="outline" onClick={() => router.push("/exercise")} className="mt-2">
                  返回首页
                </ZhangButton>
                <ZhangButton onClick={handleRetry} className="mt-2">
                  重新开始
                </ZhangButton>
              </div>
            </ZhangBubble>
          </div>
        </ZhangCard>
      </div>
    )
  }
  
  // 如果没有题目，显示提示
  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/exercise")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </ZhangButton>
          <h1 className="text-3xl font-bold text-gray-800">错词练习</h1>
        </div>
        
        <ZhangCard className="p-8 text-center">
          <div className="flex flex-col items-center">
            <ZhangAvatar mood="thinking" size="lg" className="mb-4" />
            <ZhangBubble>
              <h3 className="text-xl font-bold mb-2">暂无题目</h3>
              <p className="text-gray-600 mb-4">未能找到有效的题目数据</p>
              <div className="flex justify-center">
                <ZhangButton variant="outline" onClick={() => router.push("/exercise")} className="mt-2">
                  返回首页
                </ZhangButton>
              </div>
            </ZhangBubble>
          </div>
        </ZhangCard>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/exercise")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800">错词练习</h1>
        
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
              <p className="text-sm text-gray-500">选择正确的选项</p>
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
            <p className="text-lg mb-6">{currentQuestion.text}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <ZhangButton
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    ${showFeedback && option === currentQuestion.blank.correctAnswer ? "bg-green-100 border-green-500 text-green-700" : ""}
                    ${showFeedback && option === selectedAnswer && option !== currentQuestion.blank.correctAnswer ? "bg-red-100 border-red-500 text-red-700" : ""}
                    justify-start text-left px-4 py-3
                  `}
                  disabled={showFeedback}
                >
                  <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
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
                      {getFeedbackContent()}
                    </p>
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