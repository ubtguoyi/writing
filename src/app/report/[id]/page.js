"use client"

export const runtime = 'edge';

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
import html2pdf from 'html2pdf.js'
import { GRADE_MAP } from "@/lib/constants"

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
    wrong_words: "",
    improvement_list: []
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
          
          if (baseData.score_sum) {
            scoreData.logic = Number(baseData.score_sum); // Use original scale (0-20)
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
    let improvement_list = [];
    
    // Process the output data to extract correction data
    if (outputData) {
      try {
        // Parse wrong_char if it exists as a string
        if (outputData.wrong_char) {
          try {
            if (typeof outputData.wrong_char === 'string') {
              // 检查是否是Python风格的字典字符串（使用单引号）
              if (outputData.wrong_char.includes("'") && (outputData.wrong_char.startsWith("[") || outputData.wrong_char.startsWith("{"))) {
                try {
                  // 处理Python风格的字典字符串
                  let jsonString = outputData.wrong_char
                    .replace(/'/g, '"') // 将单引号替换为双引号
                    .replace(/"([^"]*)"/g, function(match) {
                      // 处理内部引号问题
                      return match.replace(/\\"/g, "'");
                    });
                  
                  // 处理可能存在的特殊引号问题（如 "应为"代表队员"" 这种格式）
                  jsonString = jsonString.replace(/"应为"([^"]*)""/, '"应为\'$1\'"');
                  
                  console.log("转换后的JSON字符串:", jsonString);
                  
                  try {
                    const parsedData = JSON.parse(jsonString);
                    
                    // 处理可能的数组格式
                    if (Array.isArray(parsedData)) {
                      // 将数组转换为对象格式，以便后续处理
                      wrong_char = parsedData.reduce((obj, item, index) => {
                        obj[index] = item;
                        return obj;
                      }, {});
                    } else {
                      wrong_char = parsedData;
                    }
                  } catch (jsonErr) {
                    console.error("JSON解析错误:", jsonErr);
                    
                    // 手动创建对象
                    // 从字符串中提取错误文字信息
                    const wrongCharMatch = outputData.wrong_char.match(/'wrong_char':\s*'([^']*)'/) || 
                                          outputData.wrong_char.match(/"wrong_char":\s*"([^"]*)"/) ||
                                          ['', outputData.wrong_char.substring(0, 20)];
                    
                    const wrongTypeMatch = outputData.wrong_char.match(/'wrong_type':\s*'([^']*)'/) || 
                                          outputData.wrong_char.match(/"wrong_type":\s*"([^"]*)"/) ||
                                          ['', '格式错误'];
                    
                    const correctCharMatch = outputData.wrong_char.match(/'correct_char':\s*'([^']*)'/) || 
                                            outputData.wrong_char.match(/"correct_char":\s*"([^"]*)"/) ||
                                            ['', '无法解析'];
                    
                    wrong_char = {
                      '0': {
                        wrong_char: wrongCharMatch[1],
                        wrong_type: wrongTypeMatch[1],
                        correct_char: correctCharMatch[1]
                      }
                    };
                  }
                } catch (e) {
                  console.error("处理Python风格字典错误:", e);
                  // 创建一个默认对象
                  wrong_char = {
                    '0': {
                      wrong_char: outputData.wrong_char.substring(0, 30),
                      wrong_type: '解析错误',
                      correct_char: '无法正确解析'
                    }
                  };
                }
              } else {
                // 尝试解析wrong_char字符串为JSON对象
                wrong_char = JSON.parse(outputData.wrong_char);
                
                // 处理可能的双重字符串化情况
                if (typeof wrong_char === 'string') {
                  try {
                    wrong_char = JSON.parse(wrong_char);
                  } catch (innerErr) {
                    console.error("Error parsing nested wrong_char string:", innerErr);
                  }
                }
              }
            } else {
              wrong_char = outputData.wrong_char;
            }
            console.log("Processed wrong_char:", wrong_char);
          } catch (e) {
            console.error("Error parsing wrong_char:", e);
            // 解析失败时，创建一个基本对象以展示原始数据
            wrong_char = {
              '0': {
                wrong_char: String(outputData.wrong_char).substring(0, 50),
                wrong_type: '解析失败',
                correct_char: '数据格式错误'
              }
            };
          }
        }
        
        // Get wrong_sentence if it exists
        if (outputData.wrong_sentence) {
          if (Array.isArray(outputData.wrong_sentence)) {
            wrong_sentence = outputData.wrong_sentence;
          } else if (typeof outputData.wrong_sentence === 'string') {
            try {
              // 尝试解析wrong_sentence字符串为JSON数组
              wrong_sentence = JSON.parse(outputData.wrong_sentence);
              
              // 处理可能的双重字符串化情况
              if (typeof wrong_sentence === 'string') {
                try {
                  wrong_sentence = JSON.parse(wrong_sentence);
                } catch (innerErr) {
                  console.error("Error parsing nested wrong_sentence string:", innerErr);
                }
              }
            } catch (e) {
              console.error("Error parsing wrong_sentence:", e);
            }
          }
          console.log("Processed wrong_sentence:", wrong_sentence);
        }
        
        // Get wrong_words if it exists
        if (outputData.wrong_words) {
          if (typeof outputData.wrong_words === 'string') {
            try {
              // Try to parse the JSON string
              const parsedData = JSON.parse(outputData.wrong_words);
              
              // Check if it might be a stringified array/object inside a string
              if (typeof parsedData === 'string') {
                try {
                  // Try parsing again in case of double stringification
                  wrong_words = JSON.parse(parsedData);
                } catch (innerErr) {
                  console.error("Error parsing nested wrong_words string:", innerErr);
                  wrong_words = parsedData;
                }
              } else {
                wrong_words = parsedData;
              }
            } catch (e) {
              console.error("Error parsing wrong_words:", e);
              wrong_words = outputData.wrong_words;
            }
          } else {
            wrong_words = outputData.wrong_words;
          }
          console.log("Processed wrong_words:", wrong_words);
        }

        // 获取improvement_list如果存在
        if (outputData.improvement_list) {
          if (Array.isArray(outputData.improvement_list)) {
            improvement_list = outputData.improvement_list;
          } else if (typeof outputData.improvement_list === 'string') {
            try {
              // 改进的嵌套JSON解析逻辑
              let parsedData = null;
              let dataString = outputData.improvement_list;
              
              // 首先尝试解析最外层
              try {
                parsedData = JSON.parse(dataString);
                console.log("第一层解析结果:", parsedData);
                
                // 检查是否需要进一步解析
                if (parsedData && typeof parsedData === 'object') {
                  // 检查是否有improvement_list字段且为字符串
                  if (parsedData.improvement_list && typeof parsedData.improvement_list === 'string') {
                    try {
                      // 解析内层JSON字符串
                      const innerData = JSON.parse(parsedData.improvement_list);
                      console.log("第二层解析结果:", innerData);
                      
                      // 如果内层解析结果有improvement_list数组
                      if (innerData && innerData.improvement_list && Array.isArray(innerData.improvement_list)) {
                        improvement_list = innerData.improvement_list;
                      } else if (Array.isArray(innerData)) {
                        improvement_list = innerData;
                      } else {
                        improvement_list = [innerData]; // 单个对象转为数组
                      }
                    } catch (e) {
                      console.error("内层JSON解析错误:", e);
                      // 如果内层解析失败，使用外层解析结果
                      if (parsedData.improvement_list) {
                        if (Array.isArray(parsedData.improvement_list)) {
                          improvement_list = parsedData.improvement_list;
                        } else {
                          improvement_list = [parsedData.improvement_list];
                        }
                      } else {
                        improvement_list = [parsedData];
                      }
                    }
                  } else if (Array.isArray(parsedData)) {
                    // 如果外层解析结果直接是数组
                    improvement_list = parsedData;
                  } else if (parsedData.improvement_list && Array.isArray(parsedData.improvement_list)) {
                    // 如果外层解析结果有improvement_list数组
                    improvement_list = parsedData.improvement_list;
                  } else {
                    // 其他情况，把对象放入数组
                    improvement_list = [parsedData];
                  }
                }
              } catch (e) {
                console.error("外层JSON解析错误:", e);
                
                // 尝试替换单引号等特殊格式处理 - 和原有代码类似
                if (dataString.includes("'") && (dataString.startsWith("[") || dataString.startsWith("{"))) {
                  try {
                    // 处理Python风格的字典字符串
                    let jsonString = dataString
                      .replace(/'/g, '"') // 将单引号替换为双引号
                      .replace(/"([^"]*)"/g, function(match) {
                        // 处理内部引号问题
                        return match.replace(/\\"/g, "'");
                      });
                    
                    // 处理可能存在的特殊引号问题
                    jsonString = jsonString.replace(/"改进后的句子"([^"]*)""/, '"改进后的句子\'$1\'"');
                    jsonString = jsonString.replace(/"原因"([^"]*)""/, '"原因\'$1\'"');
                    
                    console.log("转换后的improvement_list JSON字符串:", jsonString);
                    
                    try {
                      parsedData = JSON.parse(jsonString);
                      
                      if (Array.isArray(parsedData)) {
                        improvement_list = parsedData;
                      } else if (parsedData.improvement_list) {
                        if (Array.isArray(parsedData.improvement_list)) {
                          improvement_list = parsedData.improvement_list;
                        } else if (typeof parsedData.improvement_list === 'string') {
                          // 尝试再解析一层
                          try {
                            const deeperData = JSON.parse(parsedData.improvement_list);
                            if (deeperData.improvement_list && Array.isArray(deeperData.improvement_list)) {
                              improvement_list = deeperData.improvement_list;
                            } else if (Array.isArray(deeperData)) {
                              improvement_list = deeperData;
                            } else {
                              improvement_list = [deeperData];
                            }
                          } catch (e) {
                            console.error("深层解析错误:", e);
                            improvement_list = [parsedData];
                          }
                        } else {
                          improvement_list = [parsedData.improvement_list];
                        }
                      } else {
                        // 创建单项数组
                        improvement_list = [parsedData];
                      }
                    } catch (jsonErr) {
                      console.error("improvement_list JSON解析错误:", jsonErr);
                      
                      // 手动提取关键信息
                      try {
                        // 使用正则表达式提取信息
                        const matches = dataString.match(/\{([^{}]*)\}/g);
                        if (matches && matches.length > 0) {
                          improvement_list = matches.map(match => {
                            try {
                              return JSON.parse(match.replace(/'/g, '"'));
                            } catch (e) {
                              // 提取关键字段
                              const sentenceMatch = match.match(/sentence['":\s]+([^,}]+)/);
                              const wordMatch = match.match(/improvement_word['":\s]+([^,}]+)/);
                              const typeMatch = match.match(/improvement_type['":\s]+([^,}]+)/);
                              
                              return {
                                sentence: sentenceMatch ? sentenceMatch[1].replace(/['"]/g, '') : '',
                                improvement_word: wordMatch ? wordMatch[1].replace(/['"]/g, '') : '',
                                improvement_type: typeMatch ? typeMatch[1].replace(/['"]/g, '') : ''
                              };
                            }
                          });
                        } else {
                          improvement_list = [{
                            sentence: "无法解析的数据",
                            improvement_type: "解析错误"
                          }];
                        }
                      } catch (e) {
                        console.error("手动提取improvement_list数据失败:", e);
                      }
                    }
                  } catch (e) {
                    console.error("处理Python风格improvement_list字典错误:", e);
                  }
                }
              }
            } catch (e) {
              console.error("Error parsing improvement_list:", e);
              // 使用正则表达式从原始字符串提取信息
              try {
                // 查找可能包含JSON的部分
                const jsonMatches = outputData.improvement_list.match(/\{[^{}]*\{[^{}]*\}[^{}]*\}/g) || 
                                    outputData.improvement_list.match(/\[[^[\]]*\{[^{}]*\}[^[\]]*\]/g);
                
                if (jsonMatches && jsonMatches.length > 0) {
                  // 尝试解析每个匹配项
                  improvement_list = [];
                  jsonMatches.forEach(match => {
                    try {
                      // 清理字符串
                      const cleaned = match.replace(/\\n/g, '')
                                          .replace(/\\"/g, '"')
                                          .replace(/"\{/g, '{')
                                          .replace(/\}"/g, '}');
                      const parsed = JSON.parse(cleaned);
                      
                      if (parsed.improvement_list && Array.isArray(parsed.improvement_list)) {
                        improvement_list = improvement_list.concat(parsed.improvement_list);
                      } else {
                        improvement_list.push(parsed);
                      }
                    } catch (e) {
                      console.error("解析匹配项失败:", e);
                    }
                  });
                }
                
                // 如果上述方法失败，尝试提取关键信息
                if (improvement_list.length === 0) {
                  const sentences = outputData.improvement_list.match(/"sentence":\s*"([^"]*)"/g) || [];
                  const words = outputData.improvement_list.match(/"improvement_word":\s*"([^"]*)"/g) || [];
                  const types = outputData.improvement_list.match(/"improvement_type":\s*"([^"]*)"/g) || [];
                  
                  // 创建简单对象
                  if (sentences.length > 0) {
                    sentences.forEach((s, i) => {
                      const sentenceMatch = s.match(/"sentence":\s*"([^"]*)"/);
                      const sentence = sentenceMatch ? sentenceMatch[1] : '';
                      
                      const wordMatch = words[i] ? words[i].match(/"improvement_word":\s*"([^"]*)"/): null;
                      const word = wordMatch ? wordMatch[1] : '';
                      
                      const typeMatch = types[i] ? types[i].match(/"improvement_type":\s*"([^"]*)"/): null;
                      const type = typeMatch ? typeMatch[1] : '';
                      
                      improvement_list.push({
                        sentence: sentence,
                        improvement_word: word,
                        improvement_type: type
                      });
                    });
                  }
                }
              } catch (regexErr) {
                console.error("正则表达式提取失败:", regexErr);
              }
            }
          }
          console.log("最终处理的improvement_list:", improvement_list);
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
      wrong_words: wrong_words,
      improvement_list: improvement_list
    }));
  }, [essayId]);

  const handleShare = () => {
    alert("分享功能即将上线")
  }
  
  /**
   * 处理下载PDF功能
   * 将作文评分、详细批改和作文提升内容导出为PDF
   */
  const handleDownload = () => {
    // 先创建一个临时的元素来存放要打印的内容
    const printContent = document.createElement('div')
    printContent.classList.add('print-container')
    printContent.style.fontFamily = 'Arial, sans-serif'
    printContent.style.fontSize = '12px'
    printContent.style.maxWidth = '800px'
    printContent.style.margin = '0 auto'
    printContent.style.padding = '20px'
    
    // 添加标题和基本信息
    const headerDiv = document.createElement('div')
    headerDiv.style.textAlign = 'center'
    headerDiv.style.marginBottom = '20px'
    headerDiv.innerHTML = `
      <h1 style="font-size: 24px; margin-bottom: 8px; color: #1a56db">作文批改报告</h1>
      <p style="margin: 4px 0; color: #4b5563">年级: ${GRADE_MAP[essay.grade] || essay.grade}</p>
      <p style="margin: 4px 0; color: #4b5563">字数要求: ${essay.wordCount}</p>
      <p style="margin: 4px 0; color: #4b5563">主题要求: ${essay.title || "无"}</p>
      <div style="margin-top: 15px; padding: 10px; background-color: #f3f4f6; border-radius: 8px;">
        <p style="white-space: pre-line; text-align: left;">${essay.content}</p>
      </div>
    `
    printContent.appendChild(headerDiv)
    
    // 添加评分部分
    const scoreDiv = document.createElement('div')
    scoreDiv.style.marginBottom = '30px'
    // 去掉自动分页，改为手动控制分页
    // scoreDiv.style.pageBreakAfter = 'always'
    scoreDiv.innerHTML = `
      <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; color: #1a56db">
        1. 作文评分
      </h2>
      <div style="margin-bottom: 15px;">
        <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">总分: ${essay.totalScore} (各维度满分: 20，总分满分: 100)</p>
      </div>
    `
    
    // 添加雷达图部分
    const radarChartContainer = document.createElement('div')
    radarChartContainer.style.width = '100%'
    radarChartContainer.style.height = '300px'
    radarChartContainer.style.marginBottom = '20px'
    
    // 将雷达图容器添加到评分部分
    scoreDiv.appendChild(radarChartContainer)
    
    // 添加其他评分卡片
    const scoreCardsHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: white;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">内容</h4>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${essay.scores.content}<span style="font-size: 12px; color: #6b7280; margin-left: 5px;">/20</span></p>
          <p style="font-size: 12px; color: #374151;">${essay.scoreReasons.content || "暂无详细评分说明"}</p>
        </div>
        <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: white;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">结构</h4>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${essay.scores.structure}<span style="font-size: 12px; color: #6b7280; margin-left: 5px;">/20</span></p>
          <p style="font-size: 12px; color: #374151;">${essay.scoreReasons.structure || "暂无详细评分说明"}</p>
        </div>
        <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: white;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">语言</h4>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${essay.scores.language}<span style="font-size: 12px; color: #6b7280; margin-left: 5px;">/20</span></p>
          <p style="font-size: 12px; color: #374151;">${essay.scoreReasons.language || "暂无详细评分说明"}</p>
        </div>
        <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: white;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">主题</h4>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${essay.scores.creativity}<span style="font-size: 12px; color: #6b7280; margin-left: 5px;">/20</span></p>
          <p style="font-size: 12px; color: #374151;">${essay.scoreReasons.creativity || "暂无详细评分说明"}</p>
        </div>
        <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: white;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">卷面</h4>
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${essay.scores.logic}<span style="font-size: 12px; color: #6b7280; margin-left: 5px;">/20</span></p>
          <p style="font-size: 12px; color: #374151;">${essay.scoreReasons.logic || "暂无详细评分说明"}</p>
        </div>
      </div>
    `
    // 添加评分卡片HTML到评分部分
    const scoreCardsDiv = document.createElement('div')
    scoreCardsDiv.innerHTML = scoreCardsHTML
    scoreDiv.appendChild(scoreCardsDiv)
    
    // 添加明确的分页标记
    const pageBreakAfterScores = document.createElement('div')
    pageBreakAfterScores.style.pageBreakAfter = 'always'
    pageBreakAfterScores.style.height = '1px'
    scoreDiv.appendChild(pageBreakAfterScores)
    
    printContent.appendChild(scoreDiv)
    
    // 添加详细批改部分
    const correctionDiv = document.createElement('div')
    correctionDiv.style.marginBottom = '30px'
    // 不在这里强制分页，让内容决定分页点
    // correctionDiv.style.pageBreakAfter = 'always'
    
    // 创建批改标题
    const correctionTitle = document.createElement('h2')
    correctionTitle.style.fontSize = '18px'
    correctionTitle.style.marginTop = '30px'
    correctionTitle.style.marginBottom = '15px'
    correctionTitle.style.paddingBottom = '8px'
    correctionTitle.style.borderBottom = '1px solid #e5e7eb'
    correctionTitle.style.color = '#1a56db'
    correctionTitle.textContent = '2. 详细批改'
    correctionDiv.appendChild(correctionTitle)
    
    // 错误文字部分
    if (essay.wrong_char && (typeof essay.wrong_char === 'object') && Object.keys(essay.wrong_char).length > 0) {
      const wrongCharTitle = document.createElement('h3')
      wrongCharTitle.style.fontSize = '16px'
      wrongCharTitle.style.fontWeight = 'bold'
      wrongCharTitle.style.marginTop = '20px'
      wrongCharTitle.style.marginBottom = '10px'
      wrongCharTitle.textContent = '错误文字'
      correctionDiv.appendChild(wrongCharTitle)
      
      const wrongCharContent = document.createElement('div')
      wrongCharContent.style.backgroundColor = 'white'
      wrongCharContent.style.padding = '15px'
      wrongCharContent.style.border = '1px solid #e5e7eb'
      wrongCharContent.style.borderRadius = '8px'
      wrongCharContent.style.marginBottom = '20px'
      
      if (typeof essay.wrong_char === 'object' && !Array.isArray(essay.wrong_char)) {
        Object.entries(essay.wrong_char).forEach(([key, value], index) => {
          const itemDiv = document.createElement('div')
          itemDiv.style.marginBottom = '15px'
          itemDiv.style.paddingBottom = '15px'
          itemDiv.style.borderBottom = index < Object.keys(essay.wrong_char).length - 1 ? '1px solid #e5e7eb' : 'none'
          
          const itemTitle = document.createElement('p')
          itemTitle.style.fontWeight = 'bold'
          itemTitle.style.marginBottom = '8px'
          itemTitle.textContent = `错误文字项 #${index+1}:`
          itemDiv.appendChild(itemTitle)
          
          if (value && value.wrong_char) {
            const wrongCharDiv = document.createElement('div')
            wrongCharDiv.style.marginTop = '8px'
            
            const wrongCharLabel = document.createElement('p')
            wrongCharLabel.style.fontWeight = 'bold'
            wrongCharLabel.style.color = '#4b5563'
            wrongCharLabel.textContent = '错误文字:'
            wrongCharDiv.appendChild(wrongCharLabel)
            
            const wrongCharText = document.createElement('p')
            wrongCharText.style.marginBottom = '8px'
            wrongCharText.style.paddingLeft = '12px'
            wrongCharText.style.borderLeft = '2px solid #f87171'
            wrongCharText.textContent = value.wrong_char
            wrongCharDiv.appendChild(wrongCharText)
            
            itemDiv.appendChild(wrongCharDiv)
          }
          
          if (value && value.wrong_type) {
            const wrongTypeDiv = document.createElement('div')
            wrongTypeDiv.style.marginTop = '8px'
            
            const wrongTypeLabel = document.createElement('p')
            wrongTypeLabel.style.fontWeight = 'bold'
            wrongTypeLabel.style.color = '#4b5563'
            wrongTypeLabel.textContent = '错误类型:'
            wrongTypeDiv.appendChild(wrongTypeLabel)
            
            const wrongTypeText = document.createElement('p')
            wrongTypeText.style.paddingLeft = '12px'
            wrongTypeText.style.color = '#374151'
            wrongTypeText.textContent = value.wrong_type
            wrongTypeDiv.appendChild(wrongTypeText)
            
            itemDiv.appendChild(wrongTypeDiv)
          }
          
          if (value && value.correct_char) {
            const correctCharDiv = document.createElement('div')
            correctCharDiv.style.marginTop = '8px'
            
            const correctCharLabel = document.createElement('p')
            correctCharLabel.style.fontWeight = 'bold'
            correctCharLabel.style.color = '#4b5563'
            correctCharLabel.textContent = '正确文字:'
            correctCharDiv.appendChild(correctCharLabel)
            
            const correctCharText = document.createElement('p')
            correctCharText.style.paddingLeft = '12px'
            correctCharText.style.color = '#4b5563'
            correctCharText.textContent = value.correct_char
            correctCharDiv.appendChild(correctCharText)
            
            itemDiv.appendChild(correctCharDiv)
          }
          
          wrongCharContent.appendChild(itemDiv)
        })
      } else {
        const noDataText = document.createElement('p')
        noDataText.style.color = '#6b7280'
        noDataText.textContent = '错误文字数据格式不正确'
        wrongCharContent.appendChild(noDataText)
      }
      
      correctionDiv.appendChild(wrongCharContent)
    } else {
      const noWrongCharText = document.createElement('p')
      noWrongCharText.style.color = '#6b7280'
      noWrongCharText.style.marginBottom = '15px'
      noWrongCharText.textContent = '无错误文字'
      correctionDiv.appendChild(noWrongCharText)
    }
    
    // 错误句子部分
    const wrongSentenceTitle = document.createElement('h3')
    wrongSentenceTitle.style.fontSize = '16px'
    wrongSentenceTitle.style.fontWeight = 'bold'
    wrongSentenceTitle.style.marginTop = '20px'
    wrongSentenceTitle.style.marginBottom = '10px'
    wrongSentenceTitle.textContent = '错误句子'
    correctionDiv.appendChild(wrongSentenceTitle)
    
    if (essay.wrong_sentence) {
      const wrongSentenceContent = document.createElement('div')
      wrongSentenceContent.style.backgroundColor = 'white'
      wrongSentenceContent.style.padding = '15px'
      wrongSentenceContent.style.border = '1px solid #e5e7eb'
      wrongSentenceContent.style.borderRadius = '8px'
      wrongSentenceContent.style.marginBottom = '20px'
      
      const processSentences = (sentences) => {
        if (Array.isArray(sentences) && sentences.length > 0) {
          sentences.forEach((item, index) => {
            const itemDiv = document.createElement('div')
            itemDiv.style.marginBottom = '15px'
            itemDiv.style.paddingBottom = '15px'
            itemDiv.style.borderBottom = index < sentences.length - 1 ? '1px solid #e5e7eb' : 'none'
            
            const itemTitle = document.createElement('p')
            itemTitle.style.fontWeight = 'bold'
            itemTitle.style.marginBottom = '8px'
            itemTitle.textContent = '问题句子:'
            itemDiv.appendChild(itemTitle)
            
            const sentenceText = document.createElement('p')
            sentenceText.style.marginBottom = '8px'
            sentenceText.style.paddingLeft = '12px'
            sentenceText.style.borderLeft = '2px solid #f87171'
            sentenceText.textContent = item.sentence
            itemDiv.appendChild(sentenceText)
            
            if (item.think) {
              const thinkDiv = document.createElement('div')
              thinkDiv.style.marginTop = '8px'
              
              const thinkLabel = document.createElement('p')
              thinkLabel.style.fontWeight = 'bold'
              thinkLabel.style.color = '#4b5563'
              thinkLabel.textContent = '分析:'
              thinkDiv.appendChild(thinkLabel)
              
              const thinkText = document.createElement('p')
              thinkText.style.paddingLeft = '12px'
              thinkText.style.color = '#4b5563'
              thinkText.textContent = item.think
              thinkDiv.appendChild(thinkText)
              
              itemDiv.appendChild(thinkDiv)
            }
            
            if (item.error_type) {
              const errorTypeDiv = document.createElement('div')
              errorTypeDiv.style.marginTop = '8px'
              
              const errorTypeLabel = document.createElement('p')
              errorTypeLabel.style.fontWeight = 'bold'
              errorTypeLabel.style.color = '#4b5563'
              errorTypeLabel.textContent = '错误类型:'
              errorTypeDiv.appendChild(errorTypeLabel)
              
              const errorTypeText = document.createElement('p')
              errorTypeText.style.paddingLeft = '12px'
              errorTypeText.style.color = '#4b5563'
              errorTypeText.textContent = item.error_type
              errorTypeDiv.appendChild(errorTypeText)
              
              itemDiv.appendChild(errorTypeDiv)
            }
            
            wrongSentenceContent.appendChild(itemDiv)
          })
        } else {
          const noDataText = document.createElement('p')
          noDataText.style.color = '#6b7280'
          noDataText.textContent = '无错误句子数据'
          wrongSentenceContent.appendChild(noDataText)
        }
      }
      
      if (Array.isArray(essay.wrong_sentence)) {
        processSentences(essay.wrong_sentence)
      } else if (essay.wrong_sentence.wrong_sentence_list && Array.isArray(essay.wrong_sentence.wrong_sentence_list)) {
        processSentences(essay.wrong_sentence.wrong_sentence_list)
      } else {
        const noDataText = document.createElement('p')
        noDataText.style.color = '#6b7280'
        noDataText.textContent = '错误句子数据格式不正确'
        wrongSentenceContent.appendChild(noDataText)
      }
      
      correctionDiv.appendChild(wrongSentenceContent)
    } else {
      const noWrongSentenceText = document.createElement('p')
      noWrongSentenceText.style.color = '#6b7280'
      noWrongSentenceText.style.marginBottom = '15px'
      noWrongSentenceText.textContent = '无错误句子'
      correctionDiv.appendChild(noWrongSentenceText)
    }
    
    // 在这里添加明确的分页标记
    const pageBreakAfterCorrection = document.createElement('div')
    pageBreakAfterCorrection.style.pageBreakAfter = 'always'
    pageBreakAfterCorrection.style.height = '1px'
    correctionDiv.appendChild(pageBreakAfterCorrection)
    
    printContent.appendChild(correctionDiv)
    
    // 添加作文提升部分
    const improvementDiv = document.createElement('div')
    improvementDiv.style.marginBottom = '30px'
    
    const improvementTitle = document.createElement('h2')
    improvementTitle.style.fontSize = '18px'
    improvementTitle.style.marginTop = '30px'
    improvementTitle.style.marginBottom = '15px'
    improvementTitle.style.paddingBottom = '8px'
    improvementTitle.style.borderBottom = '1px solid #e5e7eb'
    improvementTitle.style.color = '#1a56db'
    improvementTitle.textContent = '3. 作文提升'
    improvementDiv.appendChild(improvementTitle)
    
    if (essay.improvement_list && essay.improvement_list.length > 0) {
      const improvementContent = document.createElement('div')
      improvementContent.style.backgroundColor = 'white'
      improvementContent.style.padding = '15px'
      improvementContent.style.border = '1px solid #e5e7eb'
      improvementContent.style.borderRadius = '8px'
      
      const improvementSubtitle = document.createElement('h3')
      improvementSubtitle.style.fontSize = '16px'
      improvementSubtitle.style.fontWeight = 'bold'
      improvementSubtitle.style.marginBottom = '15px'
      improvementSubtitle.textContent = '改进建议'
      improvementContent.appendChild(improvementSubtitle)
      
      if (Array.isArray(essay.improvement_list)) {
        essay.improvement_list.forEach((item, index) => {
          const itemDiv = document.createElement('div')
          itemDiv.style.paddingTop = '15px'
          itemDiv.style.paddingBottom = '15px'
          itemDiv.style.borderBottom = index < essay.improvement_list.length - 1 ? '1px solid #e5e7eb' : 'none'
          
          // 为每个改进项目添加分页避免标记（防止项目内部被分割）
          if (index > 0 && index % 2 === 0) {
            itemDiv.style.pageBreakInside = 'avoid'
          }
          
          const itemHeader = document.createElement('div')
          itemHeader.style.display = 'flex'
          itemHeader.style.justifyContent = 'space-between'
          itemHeader.style.alignItems = 'center'
          itemHeader.style.marginBottom = '8px'
          
          const itemTitle = document.createElement('h4')
          itemTitle.style.fontSize = '16px'
          itemTitle.style.fontWeight = 'bold'
          itemTitle.style.color = '#111827'
          itemTitle.textContent = `改进建议 #${index+1}`
          itemHeader.appendChild(itemTitle)
          
          if (item.word_class) {
            const wordClassSpan = document.createElement('span')
            wordClassSpan.style.padding = '4px 8px'
            wordClassSpan.style.fontSize = '10px'
            wordClassSpan.style.fontWeight = '500'
            wordClassSpan.style.backgroundColor = '#eff6ff'
            wordClassSpan.style.color = '#3b82f6'
            wordClassSpan.style.borderRadius = '9999px'
            wordClassSpan.textContent = item.word_class
            itemHeader.appendChild(wordClassSpan)
          }
          
          itemDiv.appendChild(itemHeader)
          
          if (item.sentence) {
            const sentenceDiv = document.createElement('div')
            sentenceDiv.style.marginTop = '12px'
            
            const sentenceLabel = document.createElement('p')
            sentenceLabel.style.fontWeight = 'bold'
            sentenceLabel.style.color = '#4b5563'
            sentenceLabel.textContent = '原句:'
            sentenceDiv.appendChild(sentenceLabel)
            
            const sentenceText = document.createElement('p')
            sentenceText.style.marginBottom = '8px'
            sentenceText.style.paddingLeft = '12px'
            sentenceText.style.paddingTop = '8px'
            sentenceText.style.paddingBottom = '8px'
            sentenceText.style.borderLeft = '2px solid #fbbf24'
            sentenceText.style.backgroundColor = '#fef3c7'
            sentenceText.style.borderTopRightRadius = '6px'
            sentenceText.style.borderBottomRightRadius = '6px'
            sentenceText.textContent = item.sentence
            sentenceDiv.appendChild(sentenceText)
            
            itemDiv.appendChild(sentenceDiv)
          }
          
          if (item.improvement_word) {
            const wordDiv = document.createElement('div')
            wordDiv.style.marginTop = '12px'
            
            const wordLabel = document.createElement('p')
            wordLabel.style.fontWeight = 'bold'
            wordLabel.style.color = '#4b5563'
            wordLabel.textContent = '需要改进的词语:'
            wordDiv.appendChild(wordLabel)
            
            const wordContent = document.createElement('div')
            wordContent.style.marginBottom = '8px'
            wordContent.style.paddingLeft = '12px'
            wordContent.style.paddingTop = '8px'
            wordContent.style.paddingBottom = '8px'
            wordContent.style.borderLeft = '2px solid #f87171'
            wordContent.style.backgroundColor = '#fee2e2'
            wordContent.style.borderTopRightRadius = '6px'
            wordContent.style.borderBottomRightRadius = '6px'
            
            const wordText = document.createElement('span')
            wordText.style.fontWeight = '500'
            wordText.textContent = item.improvement_word
            wordContent.appendChild(wordText)
            
            wordDiv.appendChild(wordContent)
            itemDiv.appendChild(wordDiv)
          }
          
          if (item.improvement_type) {
            const typeDiv = document.createElement('div')
            typeDiv.style.marginTop = '12px'
            
            const typeLabel = document.createElement('p')
            typeLabel.style.fontWeight = 'bold'
            typeLabel.style.color = '#4b5563'
            typeLabel.textContent = '改进原因:'
            typeDiv.appendChild(typeLabel)
            
            const typeText = document.createElement('p')
            typeText.style.paddingLeft = '12px'
            typeText.style.paddingTop = '8px'
            typeText.style.paddingBottom = '8px'
            typeText.style.color = '#4b5563'
            typeText.textContent = item.improvement_type
            typeDiv.appendChild(typeText)
            
            itemDiv.appendChild(typeDiv)
          }
          
          // 推荐替换词
          if (item.recommended_word) {
            const recDiv = document.createElement('div')
            recDiv.style.marginTop = '12px'
            
            const recLabel = document.createElement('p')
            recLabel.style.fontWeight = 'bold'
            recLabel.style.color = '#4b5563'
            recLabel.textContent = '推荐用词:'
            recDiv.appendChild(recLabel)
            
            const recContent = document.createElement('div')
            recContent.style.paddingLeft = '12px'
            recContent.style.paddingTop = '8px'
            recContent.style.paddingBottom = '8px'
            recContent.style.display = 'flex'
            recContent.style.flexWrap = 'wrap'
            recContent.style.gap = '8px'
            
            if (Array.isArray(item.recommended_word)) {
              item.recommended_word.forEach(word => {
                const wordSpan = document.createElement('span')
                wordSpan.style.padding = '4px 12px'
                wordSpan.style.backgroundColor = '#ecfdf5'
                wordSpan.style.color = '#047857'
                wordSpan.style.borderRadius = '6px'
                wordSpan.style.border = '1px solid #d1fae5'
                wordSpan.style.fontWeight = '500'
                wordSpan.textContent = word
                recContent.appendChild(wordSpan)
              })
            } else if (typeof item.recommended_word === 'string') {
              const wordSpan = document.createElement('span')
              wordSpan.style.padding = '4px 12px'
              wordSpan.style.backgroundColor = '#ecfdf5'
              wordSpan.style.color = '#047857'
              wordSpan.style.borderRadius = '6px'
              wordSpan.style.border = '1px solid #d1fae5'
              wordSpan.style.fontWeight = '500'
              wordSpan.textContent = item.recommended_word
              recContent.appendChild(wordSpan)
            }
            
            recDiv.appendChild(recContent)
            itemDiv.appendChild(recDiv)
          }
          
          if (item.improved_sentence) {
            const improvedDiv = document.createElement('div')
            improvedDiv.style.marginTop = '12px'
            
            const improvedLabel = document.createElement('p')
            improvedLabel.style.fontWeight = 'bold'
            improvedLabel.style.color = '#4b5563'
            improvedLabel.textContent = '改进后:'
            improvedDiv.appendChild(improvedLabel)
            
            const improvedText = document.createElement('p')
            improvedText.style.paddingLeft = '12px'
            improvedText.style.paddingTop = '8px'
            improvedText.style.paddingBottom = '8px'
            improvedText.style.borderLeft = '2px solid #34d399'
            improvedText.style.backgroundColor = '#d1fae5'
            improvedText.style.borderTopRightRadius = '6px'
            improvedText.style.borderBottomRightRadius = '6px'
            improvedText.textContent = item.improved_sentence
            improvedDiv.appendChild(improvedText)
            
            itemDiv.appendChild(improvedDiv)
          }
          
          improvementContent.appendChild(itemDiv)
        })
      } else {
        const noDataText = document.createElement('p')
        noDataText.style.color = '#6b7280'
        noDataText.textContent = '无法正确解析改进建议数据'
        improvementContent.appendChild(noDataText)
      }
      
      improvementDiv.appendChild(improvementContent)
    } else {
      const noImprovementDiv = document.createElement('div')
      noImprovementDiv.style.backgroundColor = '#ecfdf5'
      noImprovementDiv.style.padding = '15px'
      noImprovementDiv.style.borderRadius = '8px'
      noImprovementDiv.style.marginBottom = '20px'
      noImprovementDiv.style.border = '1px solid #d1fae5'
      
      const noImprovementTitle = document.createElement('h3')
      noImprovementTitle.style.fontSize = '16px'
      noImprovementTitle.style.fontWeight = 'bold'
      noImprovementTitle.style.marginBottom = '10px'
      noImprovementTitle.style.color = '#065f46'
      noImprovementTitle.textContent = '暂无作文提升建议'
      noImprovementDiv.appendChild(noImprovementTitle)
      
      const noImprovementText = document.createElement('p')
      noImprovementText.style.color = '#4b5563'
      noImprovementText.textContent = '系统未检测到需要改进的内容，或者暂无针对性建议。'
      noImprovementDiv.appendChild(noImprovementText)
      
      improvementDiv.appendChild(noImprovementDiv)
    }
    
    printContent.appendChild(improvementDiv)
    
    // 添加页脚
    const footerDiv = document.createElement('div')
    footerDiv.style.marginTop = '30px'
    footerDiv.style.textAlign = 'center'
    footerDiv.style.color = '#9ca3af'
    footerDiv.style.fontSize = '10px'
    footerDiv.innerHTML = `<p>作文批改报告 - 由AI作文批改系统生成 - ${new Date().toLocaleDateString()}</p>`
    printContent.appendChild(footerDiv)
    
    // 将创建的元素添加到body中（临时的，生成PDF后会移除）
    document.body.appendChild(printContent)
    
    // 创建雷达图
    import('chart.js').then(async (ChartModule) => {
      const Chart = ChartModule.default || ChartModule
      
      // 创建一个临时容器用于渲染图表，但不附加到DOM中
      const tempChartContainer = document.createElement('div')
      tempChartContainer.style.width = '500px' // 更大尺寸以确保清晰度
      tempChartContainer.style.height = '400px'
      tempChartContainer.style.position = 'absolute'
      tempChartContainer.style.left = '-9999px' // 放在视图外
      tempChartContainer.style.backgroundColor = 'white'
      
      // 创建雷达图的canvas元素
      const radarCanvas = document.createElement('canvas')
      radarCanvas.id = 'radarChartTemp'
      radarCanvas.width = 500
      radarCanvas.height = 400
      tempChartContainer.appendChild(radarCanvas)
      
      // 将临时容器添加到document中以便渲染
      document.body.appendChild(tempChartContainer)
      
      // 构建雷达图数据
      const radarData = {
        labels: ['内容', '结构', '语言', '主题', '卷面'],
        datasets: [{
          label: '得分',
          data: [
            Number(essay.scores.content) || 0,
            Number(essay.scores.structure) || 0, 
            Number(essay.scores.language) || 0,
            Number(essay.scores.creativity) || 0,
            Number(essay.scores.logic) || 0
          ],
          backgroundColor: 'rgba(136, 132, 216, 0.6)',
          borderColor: 'rgba(136, 132, 216, 1)',
          pointBackgroundColor: 'rgba(136, 132, 216, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(136, 132, 216, 1)'
        }]
      }
      
      // 雷达图配置
      const radarOptions = {
        scale: {
          ticks: {
            beginAtZero: true,
            max: 20,
            min: 0,
            stepSize: 5
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: false // 禁用工具提示以避免渲染问题
          }
        },
        maintainAspectRatio: true,
        responsive: true,
        animation: false // 禁用动画以加快渲染
      }
      
      // 渲染雷达图
      const radarChart = new Chart(radarCanvas, {
        type: 'radar',
        data: radarData,
        options: radarOptions
      })
      
      // 等待图表渲染
      await new Promise(resolve => setTimeout(resolve, 200))
      
      try {
        // 导入html2canvas
        const html2canvasModule = await import('html2canvas')
        const html2canvas = html2canvasModule.default || html2canvasModule
        
        // 将图表转换为图像
        const canvas = await html2canvas(tempChartContainer, {
          backgroundColor: 'white',
          scale: 2, // 更高质量
          logging: false
        })
        
        // 创建图像元素并设置为图表的data URL
        const chartImg = document.createElement('img')
        chartImg.src = canvas.toDataURL('image/png')
        chartImg.style.width = '100%'
        chartImg.style.height = 'auto'
        chartImg.style.maxWidth = '450px'
        chartImg.style.margin = '0 auto'
        chartImg.style.display = 'block'
        chartImg.style.border = '1px solid #f3f4f6'
        chartImg.style.borderRadius = '8px'
        chartImg.style.padding = '10px'
        chartImg.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
        
        // 清空雷达图容器并添加图像
        radarChartContainer.innerHTML = ''
        radarChartContainer.appendChild(chartImg)
        
        // 清理临时图表容器
        document.body.removeChild(tempChartContainer)
        
        // 配置PDF选项
        const pdfOptions = {
          margin: [10, 10, 10, 10],
          filename: `作文批改报告_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          // 添加精细的分页控制
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }
        
        // 生成PDF
        html2pdf().from(printContent).set(pdfOptions).save().then(() => {
          // 移除临时元素
          document.body.removeChild(printContent)
        })
      } catch (error) {
        console.error('渲染雷达图出错:', error)
        
        // 出错时使用文本备份方案
        const errorText = document.createElement('div')
        errorText.innerHTML = `
          <p style="text-align: center; margin: 20px 0; font-style: italic; color: #666;">
            图表数据：内容(${essay.scores.content}/20), 结构(${essay.scores.structure}/20), 
            语言(${essay.scores.language}/20), 主题(${essay.scores.creativity}/20), 
            卷面(${essay.scores.logic}/20)
          </p>
        `
        radarChartContainer.innerHTML = ''
        radarChartContainer.appendChild(errorText)
        
        // 仍然生成PDF，但没有雷达图
        const pdfOptions = {
          margin: [10, 10, 10, 10],
          filename: `作文批改报告_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }
        
        // 生成PDF
        html2pdf().from(printContent).set(pdfOptions).save().then(() => {
          // 移除临时元素
          document.body.removeChild(printContent)
        })
      }
    }).catch(error => {
      console.error('加载Chart.js失败:', error)
      
      // 即使加载Chart.js失败也继续生成PDF，只是没有雷达图
      const textFallback = document.createElement('div')
      textFallback.innerHTML = `
        <p style="text-align: center; margin: 20px 0; font-style: italic; color: #666;">
          图表数据：内容(${essay.scores.content}/20), 结构(${essay.scores.structure}/20), 
          语言(${essay.scores.language}/20), 主题(${essay.scores.creativity}/20), 
          卷面(${essay.scores.logic}/20)
        </p>
      `
      radarChartContainer.innerHTML = ''
      radarChartContainer.appendChild(textFallback)
      
      const pdfOptions = {
        margin: [10, 10, 10, 10],
        filename: `作文批改报告_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      // 生成PDF
      html2pdf().from(printContent).set(pdfOptions).save().then(() => {
        // 移除临时元素
        document.body.removeChild(printContent)
      })
    })
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
                {console.log("渲染错误文字，数据:", essay.wrong_char)}
                {essay.wrong_char && (typeof essay.wrong_char === 'object') && Object.keys(essay.wrong_char).length > 0 ? (
                  <div className="bg-white p-4 rounded-md border">
                    {/* 检查wrong_char是否为对象格式，且包含至少一个属性 */}
                    {typeof essay.wrong_char === 'object' && !Array.isArray(essay.wrong_char) ? (
                      Object.entries(essay.wrong_char).map(([key, value], index) => (
                        <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                          {console.log("渲染错误文字项:", key, value)}
                          <p className="font-medium text-gray-900 mb-2">错误文字项 #{index+1}:</p>
                          
                          <div className="mt-2">
                            <p className="font-medium text-gray-700">错误文字:</p>
                            <p className="mb-2 pl-3 border-l-2 border-red-400">{value && value.wrong_char ? value.wrong_char : '未指定'}</p>
                          </div>
                          
                          {value && value.wrong_type && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">错误类型:</p>
                              <p className="text-gray-600 pl-3">{value.wrong_type}</p>
                            </div>
                          )}
                          
                          {value && value.correct_char && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">正确文字:</p>
                              <p className="text-gray-600 pl-3">{value.correct_char}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">错误文字数据格式不正确: {JSON.stringify(essay.wrong_char).substring(0, 100)}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">无错误文字</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">错误句子</h3>
                {essay.wrong_sentence ? (
                  <div className="bg-white p-4 rounded-md border">
                    {Array.isArray(essay.wrong_sentence) && essay.wrong_sentence.length > 0 ? (
                      essay.wrong_sentence.map((item, index) => (
                        <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                          <p className="font-medium text-gray-900 mb-2">问题句子:</p>
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
                      ))
                    ) : essay.wrong_sentence.wrong_sentence_list && Array.isArray(essay.wrong_sentence.wrong_sentence_list) ? (
                      // 如果是 { "wrong_sentence_list": [] } 格式
                      essay.wrong_sentence.wrong_sentence_list.map((item, index) => (
                        <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                          <p className="font-medium text-gray-900 mb-2">问题句子:</p>
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
                      ))
                    ) : (
                      <p className="text-gray-600">错误句子数据格式不正确: {JSON.stringify(essay.wrong_sentence)}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">无错误句子</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">错误词汇</h3>
                {essay.wrong_words ? (
                  <div className="bg-white p-4 rounded-md border">
                    {Array.isArray(essay.wrong_words) ? (
                      essay.wrong_words.map((item, index) => (
                        <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                          <p className="font-medium text-gray-900 mb-2">错误词汇:</p>
                          
                          {item.wrong_words && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">错误词汇:</p>
                              <p className="mb-2 pl-3 border-l-2 border-red-400">{item.wrong_words}</p>
                            </div>
                          )}
                          
                          {item.wrong_type && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">错误类型:</p>
                              <p className="text-gray-600 pl-3">{item.wrong_type}</p>
                            </div>
                          )}
                          
                          {item.sentence && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">句子:</p>
                              <p className="text-gray-600 pl-3">{item.sentence}</p>
                            </div>
                          )}
                          
                          {item.wrong_reason && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">错误原因:</p>
                              <p className="text-gray-600 pl-3">{item.wrong_reason}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>
                        {essay.wrong_words.wrong_words_list && Array.isArray(essay.wrong_words.wrong_words_list) ? (
                          essay.wrong_words.wrong_words_list.map((item, index) => (
                            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                              <p className="font-medium text-gray-900 mb-2">错误词汇:</p>
                              
                              {item.wrong_words && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700">错误词汇:</p>
                                  <p className="mb-2 pl-3 border-l-2 border-red-400">{item.wrong_words}</p>
                                </div>
                              )}
                              
                              {item.wrong_type && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700">错误类型:</p>
                                  <p className="text-gray-600 pl-3">{item.wrong_type}</p>
                                </div>
                              )}
                              
                              {item.sentence && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700">句子:</p>
                                  <p className="text-gray-600 pl-3">{item.sentence}</p>
                                </div>
                              )}
                              
                              {item.wrong_reason && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700">错误原因:</p>
                                  <p className="text-gray-600 pl-3">{item.wrong_reason}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">错误词汇数据格式不正确: {JSON.stringify(essay.wrong_words)}</p>
                        )}
                      </div>
                    )}
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
              {console.log("渲染作文提升，数据:", essay.improvement_list)}
              {essay.improvement_list && essay.improvement_list.length > 0 ? (
                <div className="bg-white p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-4">改进建议</h3>
                  
                  {/* 用列表形式显示所有改进建议 */}
                  <ul className="divide-y divide-gray-200">
                    {Array.isArray(essay.improvement_list) ? (
                      essay.improvement_list.map((item, index) => (
                        <li key={index} className="py-4">
                          {console.log("渲染改进建议项:", index, item)}
                          
                          {/* 条目编号和词性标签 */}
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-medium text-gray-900">改进建议 #{index+1}</h4>
                            {item.word_class && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                {item.word_class}
                              </span>
                            )}
                          </div>
                          
                          {/* 原句 */}
                          {item.sentence && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">原句:</p>
                              <p className="mb-2 pl-3 py-2 border-l-2 border-yellow-400 bg-yellow-50 rounded-r-md">
                                {item.sentence}
                              </p>
                            </div>
                          )}
                          
                          {/* 需要改进的词语 */}
                          {item.improvement_word && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">需要改进的词语:</p>
                              <div className="mb-2 pl-3 py-2 border-l-2 border-red-400 bg-red-50 rounded-r-md">
                                <span className="font-medium">{item.improvement_word}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* 词语改进类型/原因 */}
                          {item.improvement_type && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">改进原因:</p>
                              <p className="pl-3 py-2 text-gray-600">{item.improvement_type}</p>
                            </div>
                          )}
                          
                          {/* 推荐替换词 - 数组格式 */}
                          {item.recommended_word && Array.isArray(item.recommended_word) && item.recommended_word.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">推荐用词:</p>
                              <div className="pl-3 py-2 flex flex-wrap gap-2">
                                {item.recommended_word.map((word, wordIndex) => (
                                  <span key={wordIndex} className="px-3 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 font-medium">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 推荐替换词 - 非数组格式 */}
                          {item.recommended_word && !Array.isArray(item.recommended_word) && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">推荐用词:</p>
                              <div className="pl-3 py-2">
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 font-medium">
                                  {item.recommended_word}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* 兼容旧数据结构的显示逻辑 */}
                          {item.suggestion && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">建议:</p>
                              <p className="pl-3 py-2 text-gray-600">{item.suggestion}</p>
                            </div>
                          )}
                          
                          {item.improved_sentence && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">改进后:</p>
                              <p className="pl-3 py-2 border-l-2 border-green-400 bg-green-50 rounded-r-md">
                                {item.improved_sentence}
                              </p>
                            </div>
                          )}
                          
                          {item.reason && !item.improvement_type && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">原因:</p>
                              <p className="pl-3 py-2 text-gray-600">{item.reason}</p>
                            </div>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="py-4">
                        <p className="text-gray-500">无法正确解析改进建议数据</p>
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-100">
                  <h3 className="text-lg font-medium mb-3 text-green-800">暂无作文提升建议</h3>
                  <p className="text-gray-700">
                    系统未检测到需要改进的内容，或者暂无针对性建议。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 