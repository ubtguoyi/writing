/**
 * 故事练习题的本地Mock数据
 * 此文件提供了一组默认的故事问题数据，用于开发和测试环境
 * 数据结构与API返回的结构保持一致
 */

// 本地Mock的故事问题数据
export const mockStoryQuestions = [
  {
    "id": 0,
    "question": "今天，章同学像往常一样来到学校，但一进教室，就发现同学们都围在一起，（）。",
    "img": "https://s.coze.cn/t/umC-gE_bdrI/",
    "selections": [
      {"text": "窃窃私语", "feedback": "你真棒！"},
      {"text": "大声喧哗", "feedback": "很遗憾~ 因为同学们是围在一起，小声交谈，而不是大声喧哗。"},
      {"text": "沉默不语", "feedback": "很遗憾~ 因为同学们是围在一起，小声交谈，而不是沉默不语。"},
      {"text": "欢呼雀跃", "feedback": "很遗憾~ 因为同学们是围在一起，小声交谈，而不是欢呼雀跃。"}
    ]
  },
  {
    "id": 1,
    "question": "放学铃声一响，章同学就迫不及待地冲向了地下室。入口被一块沉重的石板挡住，章同学用触手用力一推，石板竟然缓缓（    ）开了。",
    "img": "https://s.coze.cn/t/me1t9lHJLRM/",
    "selections": [
      {"text": "移", "feedback": "你真棒！+正确原因：'移'与'缓缓'搭配合理，描述了石板被推开的过程。"},
      {"text": "关", "feedback": "很遗憾~+错误原因：'关'与'缓缓'搭配不合理，不符合上下文描述的石板被推开的情境。"},
      {"text": "停", "feedback": "很遗憾~+错误原因：'停'与'缓缓'搭配不合理，不符合上下文描述的石板被推开的情境。"},
      {"text": "倒", "feedback": "很遗憾~+错误原因：'倒'与'缓缓'搭配不合理，不符合上下文描述的石板被推开的情境。"}
    ]
  },
  {
    "id": 2,
    "question": "他小心翼翼地走了进去，发现里面是一条长长的隧道，墙壁上布满了奇怪的符号。隧道里光线（），章同学打开手电筒，继续前进。",
    "img": "https://s.coze.cn/t/tDq40NV11UE/",
    "selections": [
      {"text": "昏暗", "feedback": "你真棒！光线昏暗符合隧道里光线不足的情境。"},
      {"text": "明亮", "feedback": "很遗憾~明亮与隧道里光线不足的情境不符。"},
      {"text": "刺眼", "feedback": "很遗憾~刺眼与隧道里光线不足的情境不符。"},
      {"text": "柔和", "feedback": "很遗憾~柔和与隧道里光线不足的情境不符。"}
    ]
  },
  {
    "id": 3,
    "question": "突然，他听到了一阵沙沙的声音，像是有什么东西在（ ）。章同学的心跳加快了，他警惕地环顾四周，发现是一只小老鼠在角落里啃食一块面包。他松了一口气，继续向前走。",
    "img": "https://s.coze.cn/t/GrCRDXWjSHs/",
    "selections": [
      {"text": "移动", "feedback": "你真棒！"},
      {"text": "静止", "feedback": "很遗憾~+ '静止'与上下文描述的动态情境不符，无法传达出声音的来源是活动的物体。"},
      {"text": "消失", "feedback": "很遗憾~+ '消失'与上下文描述的动态情境不符，无法传达出声音的来源是活动的物体。"},
      {"text": "出现", "feedback": "很遗憾~+ '出现'虽然描述了物体的存在，但与声音的动态性不符，无法准确传达出声音的来源是活动的物体。"}
    ]
  },
  {
    "id": 4,
    "question": "走了一会儿，隧道开始变得狭窄，章同学不得不弯下腰才能通过。就在这时，他听到了一声低沉的（），声音来自隧道的深处。章同学的心再次提到了嗓子眼，但他没有退缩，反而加快了脚步。",
    "img": "https://s.coze.cn/t/xrbgoOq8fL4/",
    "selections": [
      {"text": "咆哮", "feedback": "你真棒！"},
      {"text": "笑声", "feedback": "很遗憾~ 因为'笑声'与上下文描述的紧张氛围不符。"},
      {"text": "歌声", "feedback": "很遗憾~ 因为'歌声'与上下文描述的紧张氛围不符。"},
      {"text": "喊声", "feedback": "很遗憾~ 因为'喊声'虽然可以表示声音，但与'低沉'的形容不搭配。"}
    ]
  },
  {
    "id": 5,
    "question": "终于，隧道尽头出现了一个巨大的石室，石室中央放着一个闪闪发光的宝箱。章同学兴奋地跑过去，但就在他即将触碰到宝箱时，地面突然开始（），石室的墙壁上出现了裂缝，石块开始掉落。",
    "img": "https://s.coze.cn/t/jekSs892F0w/",
    "selections": [
      {"text": "震动", "feedback": "你真棒！"},
      {"text": "摇晃", "feedback": "很遗憾~ 虽然'摇晃'与'震动'意思相近，但在描述地面突然发生的剧烈运动时，'震动'更为准确。"},
      {"text": "静止", "feedback": "很遗憾~ '静止'是'震动'的反义词，但在此情境下，地面突然静止与上下文描述的紧张氛围不符。"},
      {"text": "旋转", "feedback": "很遗憾~ '旋转'虽然也是一种运动，但与地面突然发生的剧烈运动不符，上下文并未提及旋转的动作。"}
    ]
  },
  {
    "id": 6,
    "question": "章同学迅速反应过来，他意识到这是（），必须尽快离开。他转身就跑，但隧道已经被石块堵住了。",
    "img": "https://s.coze.cn/t/ImfPm7o9HfA/",
    "selections": [
      {"text": "陷阱", "feedback": "你真棒！"},
      {"text": "机会", "feedback": "很遗憾~ 因为上下文描述的是危险情境，'机会'与情境不符。"},
      {"text": "挑战", "feedback": "很遗憾~ 因为上下文描述的是需要逃离的危险，'挑战'与情境不符。"},
      {"text": "游戏", "feedback": "很遗憾~ 因为上下文描述的是紧急情况，'游戏'与情境不符。"}
    ]
  },
  {
    "id": 7,
    "question": "章同学急中生智，用触手抓住了一块突出的石头，用力一拉，竟然打开了一个隐藏的出口。",
    "img": "https://s.coze.cn/t/ZlWBNecFUbU/",
    "selections": [
      {"text": "急中生智", "feedback": "你真棒！正确原因：'急中生智'在紧急情况下表现出机智，符合上下文情境。"},
      {"text": "手忙脚乱", "feedback": "很遗憾~错误原因：'手忙脚乱'表示慌乱无措，与文中描述的机智行为不符。"},
      {"text": "沉着冷静", "feedback": "很遗憾~错误原因：'沉着冷静'虽然表示镇定，但缺乏文中描述的机智和快速反应。"},
      {"text": "惊慌失措", "feedback": "很遗憾~错误原因：'惊慌失措'表示极度慌乱，与文中描述的机智行为不符。"}
    ]
  },
  {
    "id": 8,
    "question": "他顺着出口爬了出去，发现自己回到了学校的（ ）。章同学长舒了一口气，虽然没能找到宝藏，但他却经历了一场惊险的冒险。",
    "img": "https://s.coze.cn/t/ETnte1q7u94/",
    "selections": [
      {"text": "花园", "feedback": "你真棒！"},
      {"text": "教室", "feedback": "很遗憾~ 教室与上下文描述的户外场景不符。"},
      {"text": "操场", "feedback": "很遗憾~ 操场虽然也是户外场景，但与花园相比，花园更符合回到学校的温馨氛围。"},
      {"text": "图书馆", "feedback": "很遗憾~ 图书馆是室内场景，与上下文描述的户外场景不符。"}
    ]
  },
  {
    "id": 9,
    "question": "他决定把这个秘密告诉同学们，让大家一起探索这个（ ）的地下世界。",
    "img": "https://s.coze.cn/t/Xt_9l6jwGn8/",
    "selections": [
      {"text": "神秘", "feedback": "你真棒！"},
      {"text": "普通", "feedback": "很遗憾~因为'普通'与'地下世界'的语境不符，无法表达出探索的未知和惊奇感。"},
      {"text": "熟悉", "feedback": "很遗憾~因为'熟悉'与'地下世界'的语境不符，无法表达出探索的未知和惊奇感。"},
      {"text": "平凡", "feedback": "很遗憾~因为'平凡'与'地下世界'的语境不符，无法表达出探索的未知和惊奇感。"}
    ]
  }
];

/**
 * 将mock数据初始化到localStorage中
 * 仅在开发环境或测试环境中使用
 */
export function initMockStoryData() {
  // 将数据存储到localStorage
  localStorage.setItem('storyQuestions', JSON.stringify(mockStoryQuestions));
  console.log('已初始化mock故事问题数据到localStorage');
  
  // 设置故事标题
  localStorage.setItem('storyTitle', '章同学的地下冒险');
  console.log('已设置mock故事标题');
  
  return mockStoryQuestions;
}

/**
 * 清除localStorage中的mock数据
 */
export function clearMockStoryData() {
  localStorage.removeItem('storyQuestions');
  localStorage.removeItem('storyTitle');
  console.log('已清除mock故事数据');
} 