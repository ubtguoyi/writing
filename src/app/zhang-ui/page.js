import React from 'react';
import {
  ZhangAvatar,
  ZhangFull,
  ZhangBubble,
  ZhangButton,
  ZhangTentacleButton,
  ZhangInput,
  ZhangTextarea,
  ZhangEssayInput,
  ZhangCard,
  ZhangProgressCard,
  ZhangAchievementCard,
  ZhangFeedback
} from '@/components/zhang';

export default function ZhangUIPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">章同学 UI 设计系统</h1>
      <p className="text-lg text-muted-foreground mb-8">小学作文批改应用 UI 组件展示</p>
      
      <div className="space-y-12">
        {/* 章同学角色展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">章同学角色</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="default" size="lg" />
              <p className="mt-2 text-sm text-center">默认</p>
            </div>
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="happy" size="lg" />
              <p className="mt-2 text-sm text-center">开心</p>
            </div>
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="thinking" size="lg" />
              <p className="mt-2 text-sm text-center">思考</p>
            </div>
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="surprised" size="lg" />
              <p className="mt-2 text-sm text-center">惊讶</p>
            </div>
            <div className="flex flex-col items-center">
              <ZhangAvatar mood="sad" size="lg" />
              <p className="mt-2 text-sm text-center">伤心</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <ZhangFull />
          </div>
          
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex items-start gap-4">
              <ZhangAvatar mood="happy" size="md" />
              <ZhangBubble className="flex-1">
                <p>你好！我是章同学，很高兴为你批改作文。我会用我的触手连接到知识的海洋，为你提供最有用的反馈！</p>
              </ZhangBubble>
            </div>
          </div>
        </section>
        
        {/* 按钮展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">按钮</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ZhangButton>主要按钮</ZhangButton>
            <ZhangButton variant="secondary">次要按钮</ZhangButton>
            <ZhangButton variant="outline">轮廓按钮</ZhangButton>
            <ZhangButton variant="ghost">幽灵按钮</ZhangButton>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <ZhangButton size="sm">小按钮</ZhangButton>
            <ZhangButton size="md">中按钮</ZhangButton>
            <ZhangButton size="lg">大按钮</ZhangButton>
          </div>
          
          <div className="mt-4">
            <ZhangTentacleButton className="mx-auto">
              提交作文
            </ZhangTentacleButton>
          </div>
        </section>
        
        {/* 输入框展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">输入控件</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ZhangInput 
              label="姓名" 
              placeholder="请输入你的名字" 
            />
            
            <ZhangInput 
              label="学校" 
              placeholder="请输入你的学校" 
              helpText="例如：北京市海淀区实验小学"
            />
            
            <ZhangInput 
              label="年级" 
              placeholder="请输入你的年级" 
              error="请选择正确的年级"
            />
            
            <ZhangTextarea 
              label="简介" 
              placeholder="请简单介绍一下自己..." 
            />
          </div>
          
          <div className="mt-8">
            <ZhangEssayInput />
          </div>
        </section>
        
        {/* 卡片展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">卡片</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ZhangCard>
              <h3 className="text-lg font-medium mb-2">基础卡片</h3>
              <p className="text-muted-foreground">这是一个基础的卡片组件，用于展示内容。</p>
            </ZhangCard>
            
            <ZhangCard highlighted withBubbles>
              <h3 className="text-lg font-medium mb-2">突出显示卡片</h3>
              <p className="text-muted-foreground">这是一个带有气泡装饰的突出显示卡片。</p>
            </ZhangCard>
            
            <ZhangProgressCard
              title="作文进度"
              description="已完成的作文数量"
              value={7}
              max={10}
            />
            
            <ZhangAchievementCard
              title="词汇大师"
              description="在一篇作文中使用超过10个高级词汇"
              complete={true}
            />
          </div>
        </section>
        
        {/* 反馈组件展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">作文反馈</h2>
          
          <ZhangFeedback 
            overallScore={85}
            essayContent="我的家乡在一个美丽的小镇上。那里有青山绿水，风景优美。每天早上，我都能听到鸟儿的歌唱。我爱我的家乡。"
            feedback={[
              {
                type: '词汇',
                original: "我的家乡在一个美丽的小镇上。",
                suggestion: "我的家乡坐落在一个风景如画的小镇上。",
                explanation: "使用'坐落'替代'在'更加优美，'风景如画'比'美丽'更加生动具体。"
              },
              {
                type: '结构',
                original: "每天早上，我都能听到鸟儿的歌唱。我爱我的家乡。",
                suggestion: "每天清晨，鸟儿的歌声唤醒了我，这声声鸟鸣让我更加热爱这片生我养我的土地。",
                explanation: "将两个短句合并，增加情感表达，使结构更加紧凑。"
              }
            ]}
          />
        </section>
      </div>
    </div>
  );
} 