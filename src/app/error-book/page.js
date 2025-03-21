"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import { 
  ZhangButton, 
  ZhangInput, 
  ZhangCard, 
  ZhangAvatar, 
  ZhangBubble 
} from "@/components/zhang"

/**
 * 错题本页面组件
 * 显示学生学习过程中的错误用法和改正方法
 * 使用章同学UI组件风格
 */
export default function ErrorBook() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [errors, setErrors] = useState([])
  const [activeFilter, setActiveFilter] = useState("全部")
  
  // 错误类型统计
  const errorCounts = errors.reduce((acc, error) => {
    const type = error.errorType || "其他";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // 错误类型列表
  const errorTypes = ["全部", ...Object.keys(errorCounts)].filter(Boolean);

  // 从 localStorage 中加载错误数据
  useEffect(() => {
    // 获取所有纠错记录
    const correctionRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]');
    const allErrors = [];
    
    // 处理每个纠错记录，提取错误信息
    correctionRecords.forEach(record => {
      const recordDate = record.submittedAt || new Date().toISOString().split('T')[0];
      const essayTitle = record.title || "无标题作文";
      const outputData = record.outputResults || {};
      
      // 处理错误字符
      if (outputData.wrong_char) {
        try {
          let wrongChars = {};
          
          // 尝试解析 wrong_char 数据
          if (typeof outputData.wrong_char === 'string') {
            try {
              wrongChars = JSON.parse(outputData.wrong_char);
            } catch (e) {
              console.error("解析 wrong_char 错误:", e);
            }
          } else {
            wrongChars = outputData.wrong_char;
          }
          
          // 保持错误文字原始结构
          Object.entries(wrongChars).forEach(([key, value], index) => {
            if (value.wrong_char && value.wrong_char.trim() !== "") {
              allErrors.push({
                id: `char-${record.id}-${index}`,
                errorType: "错误文字",
                wrong_char: value.wrong_char,
                correct_char: value.correct_char || "",
                wrong_type: value.wrong_type || "",
                context: value.context || "",
                date: recordDate,
                essay: essayTitle
              });
            }
          });
        } catch (e) {
          console.error("处理错误字符数据时出错:", e);
        }
      }
      
      // 处理错误句子
      if (outputData.wrong_sentence) {
        try {
          let wrongSentences = [];
          
          // 尝试解析 wrong_sentence 数据
          if (typeof outputData.wrong_sentence === 'string') {
            try {
              wrongSentences = JSON.parse(outputData.wrong_sentence);
            } catch (e) {
              console.error("解析 wrong_sentence 错误:", e);
            }
          } else if (Array.isArray(outputData.wrong_sentence)) {
            wrongSentences = outputData.wrong_sentence;
          }
          
          // 保持错误句子原始结构
          wrongSentences.forEach((item, index) => {
            if (item.sentence && item.sentence.trim() !== "") {
              allErrors.push({
                id: `sentence-${record.id}-${index}`,
                errorType: "错误句子",
                sentence: item.sentence,
                think: item.think || "",
                error_type: item.error_type || "",
                correction: item.correction || "",
                date: recordDate,
                essay: essayTitle
              });
            }
          });
        } catch (e) {
          console.error("处理错误句子数据时出错:", e);
        }
      }
      
      // 处理错误词汇
      if (outputData.wrong_words) {
        try {
          let wrongWords = [];
          
          // 尝试解析 wrong_words 数据
          if (typeof outputData.wrong_words === 'string') {
            try {
              const parsedData = JSON.parse(outputData.wrong_words);
              if (typeof parsedData === 'string') {
                try {
                  wrongWords = JSON.parse(parsedData);
                } catch (innerErr) {
                  wrongWords = [parsedData];
                }
              } else if (Array.isArray(parsedData)) {
                wrongWords = parsedData;
              } else if (parsedData.wrong_words_list && Array.isArray(parsedData.wrong_words_list)) {
                wrongWords = parsedData.wrong_words_list;
              }
            } catch (e) {
              console.error("解析 wrong_words 错误:", e);
            }
          } else if (Array.isArray(outputData.wrong_words)) {
            wrongWords = outputData.wrong_words;
          } else if (outputData.wrong_words.wrong_words_list && Array.isArray(outputData.wrong_words.wrong_words_list)) {
            wrongWords = outputData.wrong_words.wrong_words_list;
          }
          
          // 保持错误词汇原始结构
          wrongWords.forEach((item, index) => {
            if (item.wrong_words && item.wrong_words.trim() !== "") {
              allErrors.push({
                id: `word-${record.id}-${index}`,
                errorType: "错误词汇",
                wrong_words: item.wrong_words,
                correct_words: item.correct_words || "",
                wrong_type: item.wrong_type || "",
                wrong_reason: item.wrong_reason || "",
                sentence: item.sentence || "",
                date: recordDate,
                essay: essayTitle
              });
            }
          });
        } catch (e) {
          console.error("处理错误词汇数据时出错:", e);
        }
      }

      // 处理错误文本段落，直接用原始格式
      if (record.errorAnalysis) {
        try {
          const errorSegments = record.errorAnalysis.split('\n\n').filter(Boolean);
          
          errorSegments.forEach((segment, segmentIndex) => {
            // 错误词汇部分
            if (segment.includes('错误词汇:') || segment.includes('错误词汇：')) {
              const lines = segment.split('\n');
              let errorWord = '';
              let errorType = '';
              let errorSentence = '';
              let errorReason = '';
              
              // 提取各行信息
              lines.forEach(line => {
                if (line.includes('错误词汇:') || line.includes('错误词汇：')) {
                  errorWord = line.split(/错误词汇[:：]/)[1]?.trim() || '';
                } else if (line.includes('错误类型:') || line.includes('错误类型：')) {
                  errorType = line.split(/错误类型[:：]/)[1]?.trim() || '';
                } else if (line.includes('句子:') || line.includes('句子：')) {
                  errorSentence = line.split(/句子[:：]/)[1]?.trim() || '';
                } else if (line.includes('错误原因:') || line.includes('错误原因：')) {
                  errorReason = line.split(/错误原因[:：]/)[1]?.trim() || '';
                }
              });
              
              // 如果找到了错误词汇，添加到错题本
              if (errorWord) {
                allErrors.push({
                  id: `analysis-word-${record.id}-${segmentIndex}`,
                  errorType: "错误词汇",
                  wrong_words: errorWord,
                  wrong_type: errorType,
                  sentence: errorSentence,
                  wrong_reason: errorReason,
                  date: recordDate,
                  essay: essayTitle
                });
              }
            }
            
            // 错误句子部分
            else if ((segment.includes('句子:') || segment.includes('句子：')) && 
                !(segment.includes('错误词汇:') || segment.includes('错误词汇：'))) {
              
              const lines = segment.split('\n');
              let errorSentence = '';
              let errorAnalysis = '';
              let errorType = '';
              
              // 提取各部分信息
              lines.forEach(line => {
                if (line.includes('句子:') || line.includes('句子：')) {
                  errorSentence = line.split(/句子[:：]/)[1]?.trim() || '';
                } else if (line.includes('分析:') || line.includes('分析：')) {
                  errorAnalysis = line.split(/分析[:：]/)[1]?.trim() || '';
                } else if (line.includes('错误类型:') || line.includes('错误类型：')) {
                  errorType = line.split(/错误类型[:：]/)[1]?.trim() || '';
                }
              });
              
              // 如果找到了错误句子，添加到错题本
              if (errorSentence) {
                allErrors.push({
                  id: `analysis-sentence-${record.id}-${segmentIndex}`,
                  errorType: "错误句子",
                  sentence: errorSentence,
                  think: errorAnalysis,
                  error_type: errorType,
                  date: recordDate,
                  essay: essayTitle
                });
              }
            }
          });
        } catch (e) {
          console.error("处理错误分析文本时出错:", e);
        }
      }
    });
    
    // 更新错误数据状态 - 按日期排序（最新的先显示）
    allErrors.sort((a, b) => {
      // 尝试将日期转换为时间戳进行比较
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      // 如果日期有效，按日期倒序排列；否则保持原顺序
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      return 0;
    });
    
    // 移除重复项（根据错误类型和关键内容）
    const uniqueErrors = allErrors.filter((error, index, self) => {
      if (error.errorType === "错误文字") {
        return index === self.findIndex(e => 
          e.errorType === "错误文字" && e.wrong_char === error.wrong_char
        );
      } else if (error.errorType === "错误词汇") {
        return index === self.findIndex(e => 
          e.errorType === "错误词汇" && e.wrong_words === error.wrong_words
        );
      } else if (error.errorType === "错误句子") {
        return index === self.findIndex(e => 
          e.errorType === "错误句子" && e.sentence === error.sentence
        );
      }
      return true;
    });
    
    setErrors(uniqueErrors);
  }, []);

  const filteredErrors = errors.filter(error => 
    (activeFilter === "全部" || error.errorType === activeFilter) &&
    (
      (error.wrong_char && error.wrong_char.includes(searchTerm)) || 
      (error.wrong_words && error.wrong_words.includes(searchTerm)) ||
      (error.sentence && error.sentence.includes(searchTerm)) ||
      (error.wrong_type && error.wrong_type.includes(searchTerm)) ||
      (error.essay && error.essay.includes(searchTerm))
    )
  );

  // 渲染错误卡片，根据不同的错误类型显示不同的内容
  const renderErrorCard = (error) => {
    return (
      <ZhangCard key={error.id} className="overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <ZhangAvatar mood="thinking" size="sm" className="mr-3" />
              <div>
                <h3 className="font-medium">{error.essay}</h3>
                <p className="text-xs text-gray-500">{error.errorType}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{error.date}</span>
          </div>
          
          {/* 根据错误类型显示不同的内容结构 */}
          {error.errorType === "错误文字" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-red-500 font-medium">错误文字</p>
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-700">{error.wrong_char || "无错误文字"}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-medium">正确文字</p>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">{error.correct_char || "需改正"}</p>
                  </div>
                </div>
              </div>
              
              {error.original_text && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">原文</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{error.original_text}</p>
                  </div>
                </div>
              )}
              
              {error.correct_text && (
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-medium">改正</p>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">{error.correct_text}</p>
                  </div>
                </div>
              )}
              
              {(error.wrong_type || error.context) && (
                <div className="space-y-1">
                  <p className="text-xs text-blue-500 font-medium">解析</p>
                  <ZhangBubble variant="light" size="sm">
                    {error.wrong_type && <p className="text-sm mb-1"><span className="font-medium">错误类型：</span>{error.wrong_type}</p>}
                    {error.context && <p className="text-sm"><span className="font-medium">上下文：</span>{error.context}</p>}
                  </ZhangBubble>
                </div>
              )}
            </div>
          )}
          
          {error.errorType === "错误词汇" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-red-500 font-medium">错误词汇</p>
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-700">{error.wrong_words || "无错误词汇"}</p>
                  </div>
                </div>
                
                {error.correct_words && (
                  <div className="space-y-1">
                    <p className="text-xs text-green-500 font-medium">正确词汇</p>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-green-700">{error.correct_words}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {error.sentence && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">句子</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{error.sentence}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-xs text-blue-500 font-medium">解析</p>
                <ZhangBubble variant="light" size="sm">
                  {error.wrong_type && <p className="text-sm mb-1"><span className="font-medium">错误类型：</span>{error.wrong_type}</p>}
                  {error.wrong_reason && <p className="text-sm"><span className="font-medium">错误原因：</span>{error.wrong_reason}</p>}
                </ZhangBubble>
              </div>
            </div>
          )}
          
          {error.errorType === "错误句子" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-red-500 font-medium">句子</p>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-700">{error.sentence || "无错误句子"}</p>
                </div>
              </div>
              
              {error.correction && (
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-medium">改正</p>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">{error.correction}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-xs text-blue-500 font-medium">解析</p>
                <ZhangBubble variant="light" size="sm">
                  {error.error_type && <p className="text-sm mb-1"><span className="font-medium">错误类型：</span>{error.error_type}</p>}
                  {error.think && <p className="text-sm"><span className="font-medium">分析：</span>{error.think}</p>}
                </ZhangBubble>
              </div>
            </div>
          )}
        </div>
      </ZhangCard>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <ZhangButton variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </ZhangButton>
        <h1 className="text-3xl font-bold text-gray-800">我的错题本</h1>
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          共 {errors.length} 条
        </span>
      </div>

      <div className="flex flex-col space-y-6">
        {/* 搜索框 */}
        <div className="relative">
          <ZhangInput
            placeholder="搜索错题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        {/* 错误类型过滤器 */}
        {errors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {errorTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeFilter === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type} {type !== "全部" && `(${errorCounts[type] || 0})`}
              </button>
            ))}
          </div>
        )}

        {/* 错题列表 */}
        {filteredErrors.length > 0 ? (
          <div className="grid gap-4">
            {filteredErrors.map(renderErrorCard)}
          </div>
        ) : (
          <ZhangCard className="p-8 text-center">
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="thinking" size="lg" className="mb-4" />
              <ZhangBubble>
                <p className="text-gray-500">暂无错题记录</p>
                <p className="text-sm text-gray-400 mt-1">错题会在你提交作文后自动整理到这里</p>
              </ZhangBubble>
            </div>
          </ZhangCard>
        )}
      </div>
    </div>
  )
}