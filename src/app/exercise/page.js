"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { 
  ZhangButton, 
  ZhangCard
} from "@/components/zhang"
import storyThemes from '../story_themes.json'

export default function ExercisePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleOptionClick = (option) => {
    if (option === "错词练习") {
      router.push("/exercise/word-practice")
    }
    // 其他选项暂时不可点击
  }

  const handleGenerateStoryClick = async () => {
    setIsGenerating(true)
    // 从主题列表中随机选择一个主题
    const themes = storyThemes.story_theme;
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    try {
      const response = await fetch('https://llm.ubtrobot.com/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-fQw6MmYMvUgO9PxJtiuTHfBg',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "inputs": {
            "theme": randomTheme,
            "grade": "三年级",
            "words": String(JSON.parse(localStorage.getItem('wrongWords') || '[]').map(item => item.wrong_words))
          },
          "response_mode": "blocking",
          "user": "abc-123"
        })
      });

      const data = await response.json();
      console.log(data);
      
      // 解析 outputs 中的 question_data 数组
      if (data.data.outputs && data.data.outputs.question_data) {
        console.log('原始 question_data:', data.data.outputs.question_data);
        
        const parsedQuestions = [];
        
        // 检查question_data是数组还是对象
        if (Array.isArray(data.data.outputs.question_data)) {
          // 处理数组情况
          data.data.outputs.question_data.forEach((item) => {
            try {
              // 基于截图，每项的格式应该是 "数字: "{\n \"question\": \"问题文本\"}"
              // 例如: "0: "{\n \"question\": \"一天，夏同学...\"}"
              if (typeof item === 'string') {
                // 提取索引和问题内容
                const match = item.match(/^(\d+):\s*"(.*)"$/);
                
                if (match && match.length === 3) {
                  const index = parseInt(match[1], 10);
                  let content = match[2];
                  
                  // 清理 JSON 字符串
                  content = content
                    .replace(/\\n/g, '\n')   // 替换 \n
                    .replace(/\\"/g, '"')    // 替换 \"
                    .replace(/\\\\/g, '\\'); // 替换 \\
                  
                  try {
                    // 解析为 JSON 对象
                    const questionObj = JSON.parse(content);
                    parsedQuestions[index] = questionObj;
                  } catch (parseError) {
                    console.warn(`无法解析问题 ${index}`, parseError);
                    // 如果解析失败，至少尝试提取问题文本
                    const questionMatch = content.match(/"question":\s*"([^"]+)"/);
                    if (questionMatch && questionMatch.length === 2) {
                      parsedQuestions[index] = { question: questionMatch[1] };
                    } else {
                      parsedQuestions[index] = { question: content };
                    }
                  }
                } else {
                  // 如果不符合预期格式，尝试直接解析
                  console.warn('项目格式不符合预期:', item);
                  parsedQuestions.push({ question: item });
                }
              } else if (typeof item === 'object' && item !== null) {
                // 如果已经是对象，直接添加
                parsedQuestions.push(item);
              }
            } catch (e) {
              console.warn('处理问题时出错:', e);
              // 确保至少有一些内容被保存
              parsedQuestions.push({ question: String(item) });
            }
          });
        } else if (typeof data.data.outputs.question_data === 'object' && data.data.outputs.question_data !== null) {
          // 处理对象情况 - 像截图中那样，键是数字，值是JSON字符串
          Object.entries(data.data.outputs.question_data).forEach(([key, value]) => {
            try {
              // 尝试从值中提取问题内容
              if (typeof value === 'string') {
                let content = value;
                
                // 清理 JSON 字符串
                content = content
                  .replace(/\\n/g, '\n')   // 替换 \n
                  .replace(/\\"/g, '"')    // 替换 \"
                  .replace(/\\\\/g, '\\'); // 替换 \\
                
                try {
                  // 解析为 JSON 对象
                  const questionObj = JSON.parse(content);
                  const index = parseInt(key, 10);
                  parsedQuestions[index] = questionObj;
                } catch (parseError) {
                  console.warn(`无法解析问题 ${key}`, parseError);
                  // 如果解析失败，至少尝试提取问题文本
                  const questionMatch = content.match(/"question":\s*"([^"]+)"/);
                  if (questionMatch && questionMatch.length === 2) {
                    parsedQuestions[parseInt(key, 10)] = { question: questionMatch[1] };
                  } else {
                    parsedQuestions[parseInt(key, 10)] = { question: content };
                  }
                }
              } else if (typeof value === 'object' && value !== null) {
                // 如果已经是对象，直接添加
                parsedQuestions[parseInt(key, 10)] = value;
              }
            } catch (e) {
              console.warn('处理问题时出错:', e);
              // 确保至少有一些内容被保存
              parsedQuestions[parseInt(key, 10)] = { question: String(value) };
            }
          });
        }
        
        // 移除数组中的空值并确保是连续的数组
        const cleanedQuestions = parsedQuestions.filter(Boolean);
        
        // 将解析后的数据存储到 localStorage
        localStorage.setItem('storyQuestions', JSON.stringify(cleanedQuestions));
        console.log('故事问题已存储到 localStorage:', cleanedQuestions);
      } else {
        console.warn('API 响应中没有找到 question_data 数组:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800 zhang-text">作文练习</h1>
      </div>
      
      <div className="space-y-4">
        {/* 生成故事选项 - 可点击 */}
        <ZhangCard 
          className={`p-6 ${isGenerating ? 'cursor-wait' : 'cursor-pointer hover:shadow-md'} transition-shadow`}
          onClick={isGenerating ? undefined : handleGenerateStoryClick}
        >
          <h2 className="text-xl font-semibold mb-2 zhang-text">生成故事</h2>
          <p className="text-gray-600 zhang-text">
            {isGenerating ? '正在生成故事中...' : '根据提示生成创意故事，提升写作能力'}
          </p>
        </ZhangCard>
        
        {/* 错词练习选项 - 生成故事时禁用 */}
        <ZhangCard 
          className={`p-6 ${isGenerating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'} transition-shadow`}
          onClick={isGenerating ? undefined : () => handleOptionClick("错词练习")}
        >
          <h2 className="text-xl font-semibold mb-2 zhang-text">错词练习</h2>
          <p className="text-gray-600 zhang-text">选择最适合的词语填空，提高词汇运用能力</p>
        </ZhangCard>
        
        {/* 尽情期待选项 - 禁用状态 */}
        <ZhangCard 
          className="p-6 cursor-not-allowed opacity-70"
        >
          <h2 className="text-xl font-semibold mb-2 zhang-text">尽情期待</h2>
          <p className="text-gray-600 zhang-text">更多练习类型正在开发中，敬请期待！</p>
        </ZhangCard>
      </div>
    </div>
  )
}