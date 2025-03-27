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
      // 使用标准Coze API端点
      const apiUrl = `https://api.coze.cn/v1/workflow/run`;
      
      // 构建正确的请求体结构，与用户示例保持一致
      const requestBody = {
        "workflow_id": "7486361244284108839",
        "parameters": {
          "theme": randomTheme,
          "grade": "三年级",
          "words": "[]"
        }
      };
      
      console.log('请求URL:', apiUrl);
      console.log('请求参数:', requestBody);
      
      // 模拟API调用或使用真实API
      let apiResponse;
      
      // 检查是否有提供的测试数据（本地开发环境使用）
      const testDataString = localStorage.getItem('testStoryData');
      if (testDataString) {
        console.log('使用测试数据');
        apiResponse = JSON.parse(testDataString);
      } else {
        // 真实API调用
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer pat_MVhYDZr6cJcjmyWQ6J61Ey6CemE5jiMhNT5Gf8jIUAuPKw8pHzYcWb44ci2RsOn5',
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        apiResponse = await response.json();
      }
      
      console.log('Coze API响应:', apiResponse);
      
      // 处理新数据格式
      let processedQuestions = [];
      
      try {
        // 检查是否是新格式的数据
        if (apiResponse && apiResponse.data && typeof apiResponse.data === 'string') {
          try {
            // 尝试解析data中的JSON字符串
            const parsedData = JSON.parse(apiResponse.data);
            
            // 检查是否包含output数组（新格式）
            if (parsedData && Array.isArray(parsedData.output)) {
              console.log('使用新数据格式处理问题');
              
              // 将每个问题项处理为标准格式
              processedQuestions = parsedData.output.map((item, index) => {
                return {
                  id: index,
                  question: item.question,
                  img: item.img,
                  selections: item.selection_list.map(selection => ({
                    text: selection.selection,
                    feedback: selection.answer
                  }))
                };
              });
              
              // 存储标题（如果有）
              if (parsedData.title) {
                localStorage.setItem('storyTitle', parsedData.title);
              }
              
              console.log('新格式问题数据处理完成:', processedQuestions);
            } else {
              console.log('解析的数据不包含output数组，尝试使用原有逻辑处理');
              // 继续使用原有的数据处理逻辑
              processOriginalFormat();
            }
          } catch (parseError) {
            console.warn('解析data字符串失败，尝试使用原有逻辑处理:', parseError);
            // 继续使用原有的数据处理逻辑
            processOriginalFormat();
          }
        } else {
          console.log('不是新格式的数据，使用原有逻辑处理');
          // 继续使用原有的数据处理逻辑
          processOriginalFormat();
        }
      } catch (processingError) {
        console.error('处理问题数据时出错:', processingError);
        // 创建一个简单的默认问题
        processedQuestions = [{ 
          id: 0,
          question: "处理问题数据时出错。请稍后再试或联系管理员。主题: " + randomTheme,
          selections: [{ text: "重试", feedback: "请重新尝试" }]
        }];
      }
      
      // 将处理后的问题数据存储到localStorage
      if (processedQuestions.length > 0) {
        localStorage.setItem('storyQuestions', JSON.stringify(processedQuestions));
        console.log('故事问题已存储到 localStorage:', processedQuestions);
      }
      
      // 内部函数：处理原始格式的数据
      function processOriginalFormat() {
        // 原有的API响应处理逻辑
        let questionData = null;
        
        // 检查可能的响应结构
        if (apiResponse && apiResponse.data && apiResponse.data.outputs && apiResponse.data.outputs.question_data) {
          // 原有API格式
          questionData = apiResponse.data.outputs.question_data;
          console.log('从原有路径找到问题数据');
        } else if (apiResponse && apiResponse.result && apiResponse.result.question_data) {
          // 可能的新API路径1
          questionData = apiResponse.result.question_data;
          console.log('从新路径1找到问题数据');
        } else if (apiResponse && apiResponse.output && apiResponse.output.question_data) {
          // 可能的新API路径2
          questionData = apiResponse.output.question_data;
          console.log('从新路径2找到问题数据');
        } else if (apiResponse && apiResponse.question_data) {
          // 可能的新API路径3
          questionData = apiResponse.question_data;
          console.log('从新路径3找到问题数据');
        } else if (apiResponse && apiResponse.data) {
          // 尝试查找任何可能包含问题数据的字段
          const potentialData = typeof apiResponse.data === 'string' ? 
            JSON.parse(apiResponse.data) : apiResponse.data;
          
          if (potentialData.question_data) {
            questionData = potentialData.question_data;
            console.log('从潜在数据中找到问题数据');
          }
        }
        
        if (questionData) {
          console.log('原始 question_data:', questionData);
          
          const parsedQuestions = [];
          
          // 检查question_data是数组还是对象
          if (Array.isArray(questionData)) {
            questionData.forEach((item) => {
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
          } else if (typeof questionData === 'object' && questionData !== null) {
            // 处理对象情况 - 像截图中那样，键是数字，值是JSON字符串
            Object.entries(questionData).forEach(([key, value]) => {
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
          } else if (typeof questionData === 'string') {
            // 处理字符串情况 - 可能是JSON字符串
            try {
              const parsedData = JSON.parse(questionData);
              if (Array.isArray(parsedData)) {
                parsedData.forEach((item, index) => {
                  if (typeof item === 'object') {
                    parsedQuestions.push(item);
                  } else {
                    parsedQuestions.push({ question: String(item) });
                  }
                });
              } else if (typeof parsedData === 'object') {
                Object.entries(parsedData).forEach(([key, value]) => {
                  const index = parseInt(key, 10);
                  if (!isNaN(index)) {
                    if (typeof value === 'object') {
                      parsedQuestions[index] = value;
                    } else {
                      parsedQuestions[index] = { question: String(value) };
                    }
                  }
                });
              }
            } catch (e) {
              console.warn('无法解析问题数据字符串:', e);
              parsedQuestions.push({ question: questionData });
            }
          }
          
          // 移除数组中的空值并确保是连续的数组
          processedQuestions = parsedQuestions.filter(Boolean);
        } else {
          console.warn('API 响应中没有找到可处理的问题数据:', apiResponse);
          // 创建一个简单的默认问题
          processedQuestions = [{ 
            question: "API未返回问题数据。请稍后再试或联系管理员。主题: " + randomTheme 
          }];
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // 创建一个简单的错误提示问题
      const errorQuestion = [{ 
        id: 0,
        question: "请求时发生错误。请稍后再试或联系管理员。错误: " + error.message,
        selections: [{ text: "重试", feedback: "请重新尝试" }]
      }];
      localStorage.setItem('storyQuestions', JSON.stringify(errorQuestion));
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