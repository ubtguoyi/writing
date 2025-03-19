"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Function to preprocess wrong_words data for better Markdown rendering
const preprocessWrongWords = (wrongWordsText) => {
  if (!wrongWordsText) return '';
  
  // Replace simple line breaks with double line breaks for proper Markdown paragraphs
  let processed = wrongWordsText.replace(/\n(?!\n)/g, '\n\n');
  
  // Format error type headers with proper Markdown syntax
  processed = processed.replace(/\*\*错误类型\*\*:/g, '## 错误类型:');
  processed = processed.replace(/\*\*错误词汇\*\*:/g, '## 错误词汇:');
  processed = processed.replace(/\*\*句子\*\*:/g, '## 句子:');
  processed = processed.replace(/\*\*错误原因\*\*:/g, '## 错误原因:');
  
  // Replace the dash with a bullet point for list items
  processed = processed.replace(/- \*\*错误类型\*\*:/g, '## 错误类型:');
  
  // Replace spaces (力气) with strong emphasis (**力气**)
  processed = processed.replace(/"([^"]*)"/g, '**$1**');
  
  return processed;
};

export default function Report() {
  const router = useRouter()
  const params = useParams()
  const essayId = Array.isArray(params?.id) ? params.id[0] : params?.id || ""
  
  const [essay, setEssay] = useState({
    id: 1,
    title: "",
    grade: "",
    wordCount: 0,
    submittedAt: "",
    content: "",
    images: [],
    scores: {
      content: 0,
      structure: 0,
      language: 0,
      creativity: 0,
      logic: 0
    },
    scoreReasons: {
      content: "",
      structure: "",
      language: "",
      creativity: "",
      logic: ""
    },
    paragraphs: [],
    wrong_char: {},
    wrong_sentence: [],
    wrong_words: ""
  })

  const [activeTab, setActiveTab] = useState("作文评分")

  useEffect(() => {
    // Only load correction records from localStorage
    const correctionRecords = JSON.parse(localStorage.getItem('correctionRecords') || '[]');
    const recordData = correctionRecords.find(record => record.id === parseInt(essayId));
    
    if (!recordData) {
      console.error("未找到ID为", essayId, "的记录数据");
      return;
    }
    
    // Log record data to check format
    console.log("Record data:", recordData);
    
    // Try to get essay text from the record data
    let essayText = "";
    
    // Get from the specific record
    if (recordData && recordData.originalText) {
      essayText = recordData.originalText;
    } else {
      essayText = "无法获取作文内容，请检查API响应格式。";
    }
    
    // Format paragraphs - split by new lines
    const paragraphs = essayText.split('\n\n').filter(p => p.trim() !== '');
    
    // Check if we have API outputs from record data
    const outputData = recordData?.outputResults || {};
    
    // Log output data to check structure
    console.log("Output data:", outputData);
    
    // Extract score information from output data
    let scoreData = {
      content: 0,
      structure: 0,
      language: 0,
      creativity: 0,
      logic: 0
    };
    
    // Create an array to store reasons for each score category
    let scoreReasons = {
      content: "",
      structure: "",
      language: "",
      creativity: "",
      logic: ""
    };
    
    // Process the output data to extract scores and reasons
    if (outputData) {
      try {
        // First, check if outputResults is already an object and not a string
        let parsedOutput = outputData;
        
        // If outputResults is a string, try to parse it
        if (typeof outputData === 'string') {
          try {
            parsedOutput = JSON.parse(outputData);
          } catch (e) {
            console.error("Error parsing outputResults string:", e);
          }
        }
        
        console.log("Parsed output data:", parsedOutput);
        
        // Extract base score
        if (parsedOutput.base) {
          let baseData = parsedOutput.base;
          
          // If base is a string, try to parse it
          if (typeof baseData === 'string') {
            try {
              baseData = JSON.parse(baseData);
            } catch (e) {
              console.error("Error parsing base data:", e);
            }
          }
          
          console.log("Processed base data:", baseData);
          
          if (baseData.score_num) {
            scoreData.logic = Number(baseData.score_num); // Use original scale (0-20)
            scoreReasons.logic = baseData.reason || "";
          }
        }
        
        // Extract construction score
        if (parsedOutput.construction) {
          let constructionData = parsedOutput.construction;
          
          // If construction is a string, try to parse it
          if (typeof constructionData === 'string') {
            try {
              constructionData = JSON.parse(constructionData);
            } catch (e) {
              console.error("Error parsing construction data:", e);
            }
          }
          
          console.log("Processed construction data:", constructionData);
          
          if (constructionData.score_sum) {
            scoreData.structure = Number(constructionData.score_sum); // Use original scale (0-20)
            scoreReasons.structure = constructionData.reason || "";
          }
        }
        
        // Extract content score
        if (parsedOutput.content) {
          let contentData = parsedOutput.content;
          
          // If content is a string, try to parse it
          if (typeof contentData === 'string') {
            try {
              contentData = JSON.parse(contentData);
            } catch (e) {
              console.error("Error parsing content data:", e);
            }
          }
          
          console.log("Processed content data:", contentData);
          
          if (contentData.score_sum) {
            // Update or supplement the content score
            if (scoreData.content === 0) {
              scoreData.content = Number(contentData.score_sum); // Use original scale
            } else {
              scoreData.content = (scoreData.content + Number(contentData.score_sum) * 10) / 2; // Average if both exist
            }
            scoreReasons.content += (scoreReasons.content ? " " : "") + (contentData.reason || "");
          }
        }
        
        // Extract language score
        if (parsedOutput.language) {
          let languageData = parsedOutput.language;
          
          // If language is a string, try to parse it
          if (typeof languageData === 'string') {
            try {
              languageData = JSON.parse(languageData);
            } catch (e) {
              console.error("Error parsing language data:", e);
            }
          }
          
          if (languageData.score_sum) {
            scoreData.language = Number(languageData.score_sum); // Use original scale
            scoreReasons.language = languageData.reason || "";
          }
        }
        
        // Extract theme score
        if (parsedOutput.theme) {
          let themeData = parsedOutput.theme;
          
          // If theme is a string, try to parse it
          if (typeof themeData === 'string') {
            try {
              themeData = JSON.parse(themeData);
            } catch (e) {
              console.error("Error parsing theme data:", e);
            }
          }
          
          console.log("Processed theme data:", themeData);
          
          if (themeData.score_sum) {
            scoreData.creativity = Number(themeData.score_sum); // Use original scale (0-20)
            scoreReasons.creativity = themeData.reason || "";
          }
        }

                // Extract theme score
                if (parsedOutput.language) {
                  let languageData = parsedOutput.language;
                  
                  // If theme is a string, try to parse it
                  if (typeof languageData === 'string') {
                    try {
                      languageData = JSON.parse(languageData);
                    } catch (e) {
                      console.error("Error parsing theme data:", e);
                    }
                  }
                  
                  console.log("Processed language data:", languageData);
                  
                  if (languageData.score_sum) {
                    scoreData.language = Number(languageData.score_sum); // Convert to 100-point scale
                    scoreReasons.language = languageData.reason || "";
                  }
                }

                console.log("scoreData", scoreData);
                console.log("scoreReasons", scoreReasons);
        
        // Calculate total score
        const totalScore = Object.values(scoreData).reduce((sum, score) => sum + score, 0);
        console.log("Total score:", totalScore);
        
        // Extract logic score
        if (parsedOutput.correct_text) {
          let correctText = parsedOutput.correct_text;
          
          // No need to JSON parse correct_text
          console.log("Processed correct_text data:", correctText);
          

        } 
        
      } catch (e) {
        console.error("Error processing outputResults:", e);
      }
    }
    
    // Extract correction data
    let wrong_char = {};
    let wrong_sentence = [];
    let wrong_words = "";
    
    // Process the output data to extract correction data
    if (outputData) {
      try {
        // Parse wrong_char if it exists as a string
        if (outputData.wrong_char) {
          try {
            if (typeof outputData.wrong_char === 'string') {
              wrong_char = JSON.parse(outputData.wrong_char);
            } else {
              wrong_char = outputData.wrong_char;
            }
            console.log("Processed wrong_char:", wrong_char);
          } catch (e) {
            console.error("Error parsing wrong_char:", e);
          }
        }
        
        // Get wrong_sentence if it exists
        if (outputData.wrong_sentence) {
          if (Array.isArray(outputData.wrong_sentence)) {
            wrong_sentence = outputData.wrong_sentence;
          } else if (typeof outputData.wrong_sentence === 'string') {
            try {
              wrong_sentence = JSON.parse(outputData.wrong_sentence);
            } catch (e) {
              console.error("Error parsing wrong_sentence:", e);
            }
          }
          console.log("Processed wrong_sentence:", wrong_sentence);
        }
        
        // Get wrong_words if it exists
        if (outputData.wrong_words) {
          wrong_words = outputData.wrong_words;
          console.log("Processed wrong_words:", wrong_words);
        }
      } catch (e) {
        console.error("Error processing correction data:", e);
      }
    }
    
    // Update state with extracted data from record
    setEssay(prev => ({
      ...prev,
      id: recordData.id,
      title: recordData.title || "",
      grade: recordData.grade || "",
      wordCount: recordData.wordCount || 0,
      submittedAt: recordData.submittedAt || "",
      content: essayText,
      paragraphs: paragraphs,
      scores: scoreData,
      scoreReasons: scoreReasons,
      totalScore: Object.values(scoreData).reduce((sum, score) => sum + score, 0),
      wrong_char: wrong_char,
      wrong_sentence: wrong_sentence,
      wrong_words: wrong_words
    }));
  }, [essayId]);

  const handleShare = () => {
    alert("分享功能即将上线")
  }
  
  const handleDownload = () => {
    alert("下载功能即将上线")
  }

  return (
    <div className="max-w-4xl mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/correction-records")} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">作文报告</h1>
        </div>
        <div className="flex mt-4 gap-4">
          <button 
            onClick={handleShare} 
            className="flex items-center gap-2 text-gray-600"
          >
            <Share2 className="w-4 h-4" />
            <span>分享</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-gray-600"
          >
            <Download className="w-4 h-4" />
            <span>下载</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* <div className="mb-6">
          <h2 className="text-xl font-bold">{essay.title}</h2>
          <p className="text-sm text-gray-500">{essay.grade} · {essay.wordCount}字</p>
        </div> */}

        {/* Add Original Essay Content Box */}
        <div className="mb-6 border rounded-md p-4 bg-white">
          {/* <h3 className="text-lg font-medium mb-3">无</h3> */}
          <div className="text-gray-700 whitespace-pre-line">
            {essay.content}
          </div>
        </div>

        <div className="flex border-b mb-6 gap-6">
          <button 
            className={`pb-2 font-medium ${activeTab === "作文评分" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("作文评分")}
          >
            作文评分
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === "详细批改" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("详细批改")}
          >
            详细批改
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === "作文提升" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("作文提升")}
          >
            作文提升
          </button>
        </div>

        <div>
          {/* 作文评分 Tab Content */}
          {activeTab === "作文评分" && (
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-2">总体评分</h3>
              <p className="text-xl font-bold mb-6">总分: {essay.totalScore} (各维度满分: 20，总分满分: 100)</p>
              
              <div style={{ width: '100%', height: 300 }} className="mb-6">
                <ResponsiveContainer>
                  <RadarChart data={[
                    { subject: '内容', A: Number(essay.scores.content) || 0, fullMark: 20 },
                    { subject: '结构', A: Number(essay.scores.structure) || 0, fullMark: 20 },
                    { subject: '语言', A: Number(essay.scores.language) || 0, fullMark: 20 },
                    { subject: '主题', A: Number(essay.scores.creativity) || 0, fullMark: 20 },
                    { subject: '卷面', A: Number(essay.scores.logic) || 0, fullMark: 20 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} />
                    <Radar name="得分" dataKey="A" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">内容</h4>
                  <p className="text-2xl font-bold">{essay.scores.content}<span className="text-sm text-gray-500 ml-1">/20</span></p>
                  <p className="text-sm text-gray-600 mt-2">{essay.scoreReasons.content || "暂无详细评分说明"}</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">结构</h4>
                  <p className="text-2xl font-bold">{essay.scores.structure}<span className="text-sm text-gray-500 ml-1">/20</span></p>
                  <p className="text-sm text-gray-600 mt-2">{essay.scoreReasons.structure || "暂无详细评分说明"}</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">语言</h4>
                  <p className="text-2xl font-bold">{essay.scores.language}<span className="text-sm text-gray-500 ml-1">/20</span></p>
                  <p className="text-sm text-gray-600 mt-2">{essay.scoreReasons.language || "暂无详细评分说明"}</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">主题</h4>
                  <p className="text-2xl font-bold">{essay.scores.creativity}<span className="text-sm text-gray-500 ml-1">/20</span></p>
                  <p className="text-sm text-gray-600 mt-2">{essay.scoreReasons.creativity || "暂无详细评分说明"}</p>
                </div>
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">卷面</h4>
                  <p className="text-2xl font-bold">{essay.scores.logic}<span className="text-sm text-gray-500 ml-1">/20</span></p>
                  <p className="text-sm text-gray-600 mt-2">{essay.scoreReasons.logic || "暂无详细评分说明"}</p>
                </div>
              </div>
            </div>
          )}

          {/* 详细批改 Tab Content */}
          {activeTab === "详细批改" && (
            <div className="mb-10">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">错误文字</h3>
                {Object.keys(essay.wrong_char).length > 0 ? (
                  <div className="bg-white p-4 rounded-md border">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border p-2 text-left">错误文字</th>
                          <th className="border p-2 text-left">错误类型</th>
                          <th className="border p-2 text-left">正确文字</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(essay.wrong_char).map(([key, value], index) => (
                          <tr key={index} className="border-b">
                            <td className="border p-2">{value.wrong_char}</td>
                            <td className="border p-2">{value.wrong_type}</td>
                            <td className="border p-2">{value.correct_char}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">无错误文字</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">错误句子</h3>
                {essay.wrong_sentence && essay.wrong_sentence.length > 0 ? (
                  <div className="bg-white p-4 rounded-md border">
                    {essay.wrong_sentence.map((item, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <p className="font-medium text-gray-900 mb-2">问题句子 {index + 1}:</p>
                        <p className="mb-2 pl-3 border-l-2 border-red-400">{item.sentence}</p>
                        
                        {item.think && (
                          <div className="mt-2">
                            <p className="font-medium text-gray-700">分析:</p>
                            <p className="text-gray-600 pl-3">{item.think}</p>
                          </div>
                        )}
                        
                        {item.error_type && (
                          <div className="mt-2">
                            <p className="font-medium text-gray-700">错误类型:</p>
                            <p className="text-gray-600 pl-3">{item.error_type}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">无错误句子</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">错误词汇</h3>
                {essay.wrong_words ? (
                  <div className="bg-white p-4 rounded-md border prose max-w-none">
                    <div className="markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Customize how certain elements are rendered
                          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-medium mt-3 mb-1 text-gray-700" {...props} />,
                          p: ({node, ...props}) => <p className="mb-3 text-gray-600" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full border-collapse border border-gray-300" {...props} /></div>,
                          th: ({node, ...props}) => <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left" {...props} />,
                          td: ({node, ...props}) => <td className="border border-gray-300 px-3 py-2" {...props} />,
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-red-300 pl-4 italic my-4 text-gray-700" {...props} />
                          ),
                          code: ({node, inline, ...props}) => (
                            inline 
                              ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                              : <pre className="bg-gray-100 p-3 rounded overflow-x-auto my-4"><code {...props} /></pre>
                          ),
                          // Add special handling for strong elements to highlight error words
                          strong: ({node, ...props}) => (
                            <strong className="font-semibold text-red-600" {...props} />
                          )
                        }}
                      >
                        {preprocessWrongWords(essay.wrong_words)}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">无错误词汇</p>
                )}
              </div>
            </div>
          )}

          {/* 作文提升 Tab Content */}
          {activeTab === "作文提升" && (
            <div className="mb-10">
              <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-100">
                <h3 className="text-lg font-medium mb-3 text-green-800">作文提升功能开发中</h3>
                <p className="text-gray-700">
                  作文提升功能正在开发中，即将上线。此功能将根据作文分析，提供针对性的改进建议，帮助提升写作水平。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 