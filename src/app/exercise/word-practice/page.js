"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X, Heart } from "lucide-react"
import { 
  ZhangButton, 
  ZhangCard, 
  ZhangAvatar, 
  ZhangBubble 
} from "@/components/zhang"
import Image from "next/image"
// 导入确保数据存在的函数
import { ensureStoryData } from "@/utils/storyDataParser"

/**
 * 错词练习页面组件
 * 提供词汇、语法等学习练习题
 * 使用章同学UI组件风格
 */

// 图片缓存服务 - 使用IndexedDB存储图片数据
const ImageCacheService = {
  DB_NAME: 'zhang-image-cache',
  STORE_NAME: 'images',
  DB_VERSION: 1,
  db: null,

  /**
   * 初始化IndexedDB数据库
   * @returns {Promise} 返回初始化完成的Promise
   */
  async init() {
    if (this.db) return Promise.resolve(this.db);
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        console.error('IndexedDB打开失败:', event);
        reject(event);
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB打开成功');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'url' });
          console.log('创建图片存储区');
        }
      };
    });
  },
  
  /**
   * 从缓存中获取图片
   * @param {string} url 图片URL
   * @returns {Promise<Object|null>} 返回图片数据或null
   */
  async getFromCache(url) {
    if (!url) return null;
    
    try {
      await this.init();
      
      return new Promise((resolve) => {
        const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(url);
        
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        
        request.onerror = () => {
          console.warn(`获取缓存图片失败: ${url}`);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('读取缓存出错:', error);
      return null;
    }
  },
  
  /**
   * 将图片保存到缓存
   * @param {string} url 图片URL
   * @param {Blob|string} data 图片数据(Blob或base64)
   * @returns {Promise<boolean>} 是否保存成功
   */
  async saveToCache(url, data) {
    if (!url || !data) return false;
    
    try {
      await this.init();
      
      return new Promise((resolve) => {
        const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        // 创建缓存记录
        const record = {
          url,
          data,
          timestamp: Date.now(),
        };
        
        const request = store.put(record);
        
        request.onsuccess = () => {
          console.log(`图片已缓存: ${url}`);
          resolve(true);
        };
        
        request.onerror = (error) => {
          console.error(`缓存图片失败: ${url}`, error);
          resolve(false);
        };
      });
    } catch (error) {
      console.error('保存缓存出错:', error);
      return false;
    }
  },
  
  /**
   * 下载图片并缓存
   * @param {string} url 图片URL
   * @returns {Promise<string>} 返回可用的图片URL（本地缓存URL或原始URL）
   */
  async cacheImage(url) {
    if (!url) return null;
    
    // 首先尝试从缓存获取
    const cachedImage = await this.getFromCache(url);
    if (cachedImage) {
      // 创建Blob URL用于显示
      const blob = typeof cachedImage.data === 'string' 
        ? this.dataURItoBlob(cachedImage.data) 
        : cachedImage.data;
      
      return URL.createObjectURL(blob);
    }
    
    // 如果缓存中没有，尝试下载并缓存
    try {
      // 通过fetch API下载图片
      const response = await fetch(url, { mode: 'cors' });
      
      if (!response.ok) {
        throw new Error(`图片下载失败: ${response.status} ${response.statusText}`);
      }
      
      // 获取图片数据
      const blob = await response.blob();
      
      // 保存到缓存
      await this.saveToCache(url, blob);
      
      // 返回Blob URL
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('图片下载缓存失败:', url, error);
      return url; // 失败时返回原始URL
    }
  },
  
  /**
   * 将Base64数据URI转换为Blob对象
   * @param {string} dataURI Base64数据URI
   * @returns {Blob} Blob对象
   */
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }
};

// 将解析后的问题转换为练习所需格式
const convertToQuestionFormat = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn('未找到有效的问题数据');
    return [];
  }
  
  return questions.map((item, index) => {
    // 检查项目是否有正确的数据结构
    console.log('处理问题项:', item);
    
    // 提取问题文本 - 可能直接在question字段中或需要从字符串解析
    let questionText = '';
    let selectionList = [];
    let imageUrl = '';
    
    try {
      // 如果item.question是字符串且看起来像JSON，尝试解析它
      if (typeof item.question === 'string' && 
          (item.question.startsWith('{') || item.question.startsWith('['))) {
        try {
          const parsedData = JSON.parse(item.question);
          // 检查解析后的数据是否有question字段
          if (parsedData.question) {
            questionText = parsedData.question;
          } else {
            questionText = item.question; // 回退到原始字符串
          }
          
          // 检查是否有selection_list
          if (Array.isArray(parsedData.selection_list)) {
            selectionList = parsedData.selection_list;
          }
          
          // 检查是否有img字段
          if (parsedData.img) {
            imageUrl = parsedData.img;
          }
        } catch (e) {
          console.warn('解析question字段失败，使用原始值:', e);
          questionText = item.question;
        }
      } else {
        // 直接使用question字段的值
        questionText = item.question || '';
      }
      
      // 检查item本身是否直接包含selections数组
      if (Array.isArray(item.selections) && item.selections.length > 0) {
        selectionList = item.selections.map(sel => ({
          selection: sel.text,
          answer: sel.feedback
        }));
      } else if (selectionList.length === 0 && Array.isArray(item.selection_list)) {
        // 或者是否有selection_list字段
        selectionList = item.selection_list;
      } else if (selectionList.length === 0 && item.selections && typeof item.selections === 'object') {
        // 处理具有特殊格式的selections对象（如从截图中看到的）
        // 例如: selections: [{text: "探险", feedback: "..."}]
        const selArray = [];
        for (const key in item.selections) {
          if (item.selections[key] && typeof item.selections[key] === 'object') {
            const selItem = item.selections[key];
            if (selItem.text) {
              selArray.push({
                selection: selItem.text,
                answer: selItem.feedback || ''
              });
            }
          }
        }
        if (selArray.length > 0) {
          selectionList = selArray;
        }
      }
      
      // 检查item本身是否包含img字段
      if (!imageUrl && item.img) {
        imageUrl = item.img;
      }
      
      console.log('提取的问题文本:', questionText);
      console.log('提取的选项列表:', selectionList);
      console.log('提取的图片URL:', imageUrl);
      
      // 找出正确答案（通常是第一个选项）
      const correctIndex = 0;
      const correctOption = selectionList[correctIndex]?.selection || 
                          selectionList[correctIndex]?.text || '';
      
      return {
        id: index + 1,
        image: imageUrl,
        text: questionText,
        options: selectionList.map(option => option.selection || option.text || ''),
        selectionFeedback: selectionList.reduce((acc, option) => {
          acc[option.selection || option.text || ''] = option.answer || option.feedback || '';
          return acc;
        }, {}),
        blank: {
          position: 0,
          correctAnswer: correctOption,
          correctIndex
        }
      };
    } catch (error) {
      console.error(`处理问题 ${index} 时出错:`, error, item);
      // 返回一个基本的问题对象，避免整个处理失败
      return {
        id: index + 1,
        image: '',
        text: `问题 ${index + 1} (处理错误)`,
        options: ['选项A', '选项B'],
        selectionFeedback: {},
        blank: {
          position: 0,
          correctAnswer: '选项A',
          correctIndex: 0
        }
      };
    }
  });
};

// 预加载图片的工具函数 - 修改为使用缓存服务
const preloadImage = async (src) => {
  if (!src) return Promise.resolve();
  
  try {
    // 使用缓存服务下载并缓存图片
    const cachedUrl = await ImageCacheService.cacheImage(src);
    
    // 额外创建Image对象确保浏览器预加载
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(cachedUrl);
      img.onerror = () => {
        console.warn(`图片预加载失败 (使用本地缓存后): ${src}`);
        resolve(src); // 返回原始URL
      };
      img.src = cachedUrl || src;
    });
  } catch (error) {
    console.error(`图片预加载和缓存失败: ${src}`, error);
    return Promise.resolve(src);
  }
};

export default function WordPractice() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [lives, setLives] = useState(3)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(false) 
  const [imageError, setImageError] = useState(false)
  const questionsRef = useRef([]) 
  // 添加缓存的图片URL状态
  const [cachedImageUrls, setCachedImageUrls] = useState({});
  
  // 图片预加载函数 - 更新为使用缓存服务并保存缓存URL
  const preloadQuestionImages = async (questionList) => {
    if (!Array.isArray(questionList) || questionList.length === 0) return;
    
    try {
      // 初始化缓存服务
      await ImageCacheService.init();
      
      // 创建URL映射对象
      const urlMap = {};
      
      // 创建预加载图片的Promise数组
      const preloadPromises = questionList
        .filter(q => q && q.image)
        .map(async (q) => {
          try {
            const cachedUrl = await preloadImage(q.image);
            if (cachedUrl) {
              urlMap[q.image] = cachedUrl;
            }
            return cachedUrl;
          } catch (err) {
            console.warn(`预加载题目图片失败: ${q.image}`, err);
            return null;
          }
        });
      
      // 并行预加载所有图片
      await Promise.allSettled(preloadPromises);
      
      // 更新缓存URL映射
      setCachedImageUrls(urlMap);
      console.log('所有题目图片预加载和缓存完成', urlMap);
    } catch (error) {
      console.warn('图片预加载过程中出现错误:', error);
    }
  };
  
  // 从localStorage获取storyQuestions数据并解析
  useEffect(() => {
    const fetchStoryQuestions = () => {
      try {
        // 首先确保有故事数据，如果没有则使用mock数据
        ensureStoryData();
        
        // 从localStorage获取storyQuestions
        const storyQuestionsStr = localStorage.getItem('storyQuestions')
        console.log('从localStorage获取的storyQuestions:', storyQuestionsStr);
        
        if (storyQuestionsStr) {
          try {
            // 解析storyQuestions JSON数组
            const storyQuestions = JSON.parse(storyQuestionsStr)
            console.log('解析后的storyQuestions数据:', storyQuestions);
            
            // 检查是否有嵌套的数据结构（如截图所示）
            let processableQuestions = storyQuestions;
            
            // 处理特殊情况：可能的嵌套结构
            if (!Array.isArray(storyQuestions) && typeof storyQuestions === 'object') {
              // 尝试查找数组属性
              for (const key in storyQuestions) {
                if (Array.isArray(storyQuestions[key])) {
                  console.log(`发现可能的问题数组在 ${key} 属性中`);
                  processableQuestions = storyQuestions[key];
                  break;
                }
              }
            }
            
            if (Array.isArray(processableQuestions) && processableQuestions.length > 0) {
              // 直接使用convertToQuestionFormat处理问题数组
              const formattedQuestions = convertToQuestionFormat(processableQuestions);
              console.log('格式化后的问题:', formattedQuestions);
              
              if (formattedQuestions.length > 0) {
                setQuestions(formattedQuestions);
                questionsRef.current = formattedQuestions; // 存储到ref中
                // 预加载图片
                preloadQuestionImages(formattedQuestions);
              } else {
                console.log('处理后没有有效的问题');
                setQuestions([]);
              }
            } else {
              console.log('storyQuestions不是有效的数组或为空');
              setQuestions([]);
            }
          } catch (parseError) {
            console.error('解析storyQuestions JSON失败:', parseError);
            setQuestions([]);
          }
        } else {
          console.log('localStorage中没有找到storyQuestions');
          setQuestions([]);
        }
      } catch (error) {
        console.error('获取storyQuestions时出错:', error)
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
  
  // 获取当前题目的图片URL(优先使用缓存)
  const getCurrentImageUrl = () => {
    const originalUrl = currentQuestion?.image;
    if (!originalUrl) return '';
    
    // 优先使用已缓存的URL
    return cachedImageUrls[originalUrl] || originalUrl;
  };
  
  // 处理图片加载状态
  const handleImageLoad = () => {
    console.log('图片加载成功:', currentQuestionIndex);
    setImageLoading(false);
    setImageError(false);
  };
  
  // 处理图片加载错误 - 添加重试逻辑
  const handleImageError = async () => {
    console.error('图片加载失败:', currentQuestion?.image);
    
    // 如果当前已经是使用缓存URL却仍然失败，或没有原始URL，直接设置错误状态
    if (!currentQuestion?.image || cachedImageUrls[currentQuestion.image] === getCurrentImageUrl()) {
      setImageLoading(false);
      setImageError(true);
      return;
    }
    
    // 尝试重新下载并缓存
    try {
      setImageLoading(true);
      const newCachedUrl = await ImageCacheService.cacheImage(currentQuestion.image);
      
      if (newCachedUrl && newCachedUrl !== currentQuestion.image) {
        // 更新缓存URL
        setCachedImageUrls(prev => ({
          ...prev,
          [currentQuestion.image]: newCachedUrl
        }));
        console.log('图片重新缓存成功:', newCachedUrl);
      } else {
        // 如果仍然无法缓存，设置错误状态
        setImageLoading(false);
        setImageError(true);
      }
    } catch (err) {
      console.error('图片重新缓存失败:', err);
      setImageLoading(false);
      setImageError(true);
    }
  };
  
  // 每当题目索引变化时重置图片状态
  useEffect(() => {
    if (currentQuestion?.image) {
      setImageLoading(true);
      setImageError(false);
      
      // 如果当前题目图片未缓存，尝试立即缓存
      if (currentQuestion.image && !cachedImageUrls[currentQuestion.image]) {
        (async () => {
          try {
            const cachedUrl = await ImageCacheService.cacheImage(currentQuestion.image);
            if (cachedUrl) {
              setCachedImageUrls(prev => ({
                ...prev,
                [currentQuestion.image]: cachedUrl
              }));
            }
          } catch (err) {
            console.warn('当前题目图片缓存失败:', err);
          }
        })();
      }
    }
  }, [currentQuestionIndex, currentQuestion]);
  
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
      // 预先设置加载状态，提升用户体验
      if (questions[currentQuestionIndex + 1]?.image) {
        setImageLoading(true);
        setImageError(false);
      }
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      // 练习完成，显示完成页面而不是直接跳转
      setCurrentQuestionIndex(questions.length); // 设置成超出索引范围的值来表示完成
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
          
          {currentQuestion?.image && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {imageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-gray-500 text-sm">图片加载失败</p>
                  </div>
                ) : (
                  <Image
                    key={`question-image-${currentQuestionIndex}-${getCurrentImageUrl()}`}
                    src={getCurrentImageUrl()}
                    alt="题目图片"
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    style={{ objectFit: 'cover' }}
                    className={`rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority={true}
                  />
                )}
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