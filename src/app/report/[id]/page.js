"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts"

export default function Report({ params }) {
  const router = useRouter()
  const { id } = params
  
  const [essay] = useState({
    id: 1,
    title: "我的暑假生活",
    grade: "初二",
    wordCount: 500,
    submittedAt: "2023-12-14 11:05:40",
    content: "今年暑假，我和家人一起去了海边度假。那里的风景非常美丽，蓝蓝的天空，清澈的海水，还有金色的沙滩。我们在海边玩了很多游戏，比如游泳、堆沙堡和捡贝壳。\n\n除了去海边，我还参加了一个科学夏令营。在那里，我学习了很多有趣的科学知识，做了许多实验。我最喜欢的是火箭实验，我们用简单的材料制作了小火箭，然后看着它们飞向天空，那感觉真是太棒了！\n\n这个暑假我还读了很多书。我最喜欢的是《哈利·波特》系列，书中的魔法世界让我着迷。我希望自己也能收到霍格沃茨的录取通知书，可以学习魔法。\n\n总的来说，这个暑假过得非常充实和快乐。我不仅玩得开心，还学到了很多新知识。我期待着下一个暑假的到来！",
    images: [
      "/essay-image-1.jpg",
      "/essay-image-2.jpg"
    ],
    scores: {
      content: 85,
      structure: 78,
      language: 90,
      creativity: 82,
      logic: 75
    },
    corrections: [
      {
        original: "蓝蓝的天空",
        suggestion: "湛蓝的天空",
        reason: "用更丰富的词汇表达颜色深度"
      },
      {
        original: "那感觉真是太棒了",
        suggestion: "那种成就感令人难以忘怀",
        reason: "避免口语化表达，使用更正式的书面语言"
      }
    ],
    comments: [
      "文章结构清晰，有明确的开头、中间和结尾",
      "内容丰富，描述了多种暑假活动",
      "可以增加一些细节描写，使文章更生动",
      "部分句子较为口语化，可以使用更多书面语表达"
    ],
    suggestions: [
      "增加更多感官描写，如声音、气味等",
      "可以尝试使用更多的修辞手法，如比喻、拟人等",
      "适当增加一些过渡句，使文章更连贯"
    ],
    detailedCorrections: {
      paragraphs: [
        {
          original: "今年暑假，我和家人一起去了海边度假。那里的风景非常美丽，蓝蓝的天空，清澈的海水，还有金色的沙滩。我们在海边玩了很多游戏，比如游泳、堆沙堡和捡贝壳。",
          corrections: [
            {
              original: "蓝蓝的天空",
              suggestion: "湛蓝的天空",
              reason: "用更丰富的词汇表达颜色深度"
            },
            {
              original: "风景非常美丽",
              suggestion: "风景如画",
              reason: "使用成语增加文采"
            }
          ]
        },
        {
          original: "除了去海边，我还参加了一个科学夏令营。在那里，我学习了很多有趣的科学知识，做了许多实验。我最喜欢的是火箭实验，我们用简单的材料制作了小火箭，然后看着它们飞向天空，那感觉真是太棒了！",
          corrections: [
            {
              original: "那感觉真是太棒了",
              suggestion: "那种成就感令人难以忘怀",
              reason: "避免口语化表达，使用更正式的书面语言"
            },
            {
              original: "学习了很多有趣的科学知识",
              suggestion: "接触到了许多引人入胜的科学知识",
              reason: "用更生动的词汇表达学习体验"
            }
          ]
        }
      ]
    },
    improvementPlan: [
      {
        category: "词汇运用",
        suggestions: [
          "增加高级词汇和成语的使用频率",
          "注意避免口语化表达，提高书面语言的正式性",
          "丰富描写词汇，特别是形容词的多样化"
        ]
      },
      {
        category: "句式结构",
        suggestions: [
          "适当使用复合句，增加文章的层次感",
          "尝试运用排比句增强表达效果",
          "注意句式的变化，避免重复使用相同句型"
        ]
      },
      {
        category: "内容深度",
        suggestions: [
          "增加对内心感受的描写，不仅描述事件还要表达情感",
          "适当加入思考和感悟，体现个人成长",
          "细化场景描写，增强文章的沉浸感"
        ]
      }
    ]
  })

  const [activeTab, setActiveTab] = useState("总体评价")

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
            onClick={() => router.push("/results")} 
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
        <div className="mb-6">
          <h2 className="text-xl font-bold">{essay.title}</h2>
          <p className="text-sm text-gray-500">{essay.grade} · {essay.wordCount}字</p>
        </div>

        <div className="flex border-b mb-6 gap-6">
          <button 
            className={`pb-2 font-medium ${activeTab === "总体评价" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("总体评价")}
          >
            总体评价
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === "详细批改" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("详细批改")}
          >
            详细批改
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === "改进建议" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("改进建议")}
          >
            改进建议
          </button>
        </div>

        <div>
          {/* 总体评价 Tab Content */}
          {activeTab === "总体评价" && (
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-2">总体评分</h3>
              <p className="text-xl font-bold mb-6">82分 <span className="text-sm font-normal text-gray-500">(优秀)</span></p>
              
              <div style={{ width: '100%', height: 300 }} className="mb-6">
                <ResponsiveContainer>
                  <RadarChart data={[
                    { subject: '内容', A: essay.scores.content },
                    { subject: '结构', A: essay.scores.structure },
                    { subject: '语言', A: essay.scores.language },
                    { subject: '创意', A: essay.scores.creativity },
                    { subject: '逻辑', A: essay.scores.logic },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="得分" dataKey="A" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">评语</h3>
                <ul className="space-y-2">
                  {essay.comments.map((comment, index) => (
                    <li key={index} className="text-gray-700">{comment}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-10 mt-10">
                <h3 className="text-lg font-medium mb-3">原文</h3>
                <div className="text-gray-700">
                  {essay.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-3">修改建议</h3>
                <div className="space-y-4">
                  {essay.corrections.map((correction, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r">
                      <p className="text-gray-700">原文: <span className="line-through">{correction.original}</span></p>
                      <p className="text-green-700 font-medium">建议: {correction.suggestion}</p>
                      <p className="text-gray-500 text-sm mt-1">理由: {correction.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 详细批改 Tab Content */}
          {activeTab === "详细批改" && (
            <div className="mb-10">
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium mb-3">详细批改说明</h3>
                <p className="text-gray-700">
                  本批改通过对作文的逐段分析，提供语言表达、结构安排和内容深度的修改建议，以帮助提升写作水平。
                </p>
              </div>

              {essay.detailedCorrections.paragraphs.map((paragraph, paragraphIndex) => (
                <div key={paragraphIndex} className="mb-8 border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3">
                    <h4 className="font-medium">段落 {paragraphIndex + 1}</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded">{paragraph.original}</p>
                    
                    <h5 className="font-medium text-blue-600 mb-2">修改建议：</h5>
                    <div className="space-y-4">
                      {paragraph.corrections.map((correction, index) => (
                        <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r">
                          <p className="text-gray-700">原文: <span className="line-through">{correction.original}</span></p>
                          <p className="text-green-700 font-medium">建议: {correction.suggestion}</p>
                          <p className="text-gray-500 text-sm mt-1">理由: {correction.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => setActiveTab("改进建议")}
                >
                  查看改进建议
                </button>
              </div>
            </div>
          )}

          {/* 改进建议 Tab Content */}
          {activeTab === "改进建议" && (
            <div className="mb-10">
              <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-100">
                <h3 className="text-lg font-medium mb-3 text-green-800">改进建议概述</h3>
                <p className="text-gray-700">
                  根据对您作文的分析，我们提供了以下针对性的改进建议，帮助您提升写作水平。建议按照计划逐步实践，循序渐进地提高各方面的写作能力。
                </p>
              </div>

              {essay.improvementPlan.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6 border rounded-md overflow-hidden">
                  <div className="bg-green-100 p-3">
                    <h4 className="font-medium text-green-800">{category.category}</h4>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {category.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-3">实践练习建议</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">尝试用修改后的表达方式重写一篇类似主题的短文</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">每天收集5个新的高级词汇或成语，并尝试在写作中应用</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">练习将简单句改写为复合句，增加语言的复杂性</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => window.print()}
                >
                  打印改进计划
                </button>
              </div>
            </div>
          )}

          <div className="mb-10">
            <h3 className="text-lg font-medium mb-3">改进建议</h3>
            <ul className="space-y-2">
              {essay.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 