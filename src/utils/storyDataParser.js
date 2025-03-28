/**
 * 解析故事练习数据并存储到localStorage
 * 
 * @param {Object|string} responseData - API响应数据，可以是对象或JSON字符串
 * @returns {Array} - 处理后的问题数组
 */
export function parseAndStoreStoryData(responseData) {
  try {
    // 如果输入是字符串，尝试解析为JSON对象
    const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
    
    console.log('解析故事数据:', data);
    
    // 检查是否有data字段，且为字符串（新格式）
    if (data && data.data && typeof data.data === 'string') {
      try {
        // 解析内嵌的JSON字符串
        const parsedInnerData = JSON.parse(data.data);
        
        // 检查是否包含output数组
        if (parsedInnerData && Array.isArray(parsedInnerData.output)) {
          console.log('检测到新格式数据结构');
          
          // 处理故事标题
          if (parsedInnerData.title) {
            localStorage.setItem('storyTitle', parsedInnerData.title);
            console.log('已存储故事标题:', parsedInnerData.title);
          }
          
          // 将问题格式化为标准结构
          const formattedQuestions = parsedInnerData.output.map((item, index) => {
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
          
          // 存储到localStorage
          localStorage.setItem('storyQuestions', JSON.stringify(formattedQuestions));
          console.log('已将新格式问题数据存储到localStorage:', formattedQuestions);
          
          return formattedQuestions;
        }
      } catch (parseError) {
        console.error('解析内嵌JSON数据失败:', parseError);
      }
    }
    
    // 检查是否是标准格式的问题数组（这里添加对mock数据的支持）
    if (data && Array.isArray(data) && data.length > 0 && data[0].question && data[0].selections) {
      console.log('检测到标准格式问题数组');
      localStorage.setItem('storyQuestions', JSON.stringify(data));
      console.log('已将标准格式问题数据存储到localStorage:', data);
      return data;
    }
    
    // 如果不是新格式，返回错误信息
    console.error('不支持的数据格式:', data);
    const errorData = [{ 
      id: 0,
      question: "数据格式不受支持，请提供正确的故事练习数据。",
      selections: [{ text: "重试", feedback: "请重新尝试" }]
    }];
    localStorage.setItem('storyQuestions', JSON.stringify(errorData));
    return errorData;
    
  } catch (error) {
    console.error('解析故事数据失败:', error);
    const errorData = [{ 
      id: 0,
      question: "解析数据时出错: " + error.message,
      selections: [{ text: "重试", feedback: "请重新尝试" }]
    }];
    localStorage.setItem('storyQuestions', JSON.stringify(errorData));
    return errorData;
  }
}

/**
 * 将示例字符串直接解析并存储到localStorage
 * 此函数专门用于处理用户在控制台中提供的示例数据
 * 
 * @param {string} exampleString - 示例数据字符串
 * @returns {Array} - 处理后的问题数组
 */
export function parseExampleStoryData(exampleString) {
  return parseAndStoreStoryData(exampleString);
}

/**
 * 用于开发和测试的函数，将示例数据存储到localStorage
 * 
 * @param {Object|string} exampleData - 示例数据对象或字符串
 */
export function storeTestStoryData(exampleData) {
  const dataString = typeof exampleData === 'string' ? exampleData : JSON.stringify(exampleData);
  localStorage.setItem('testStoryData', dataString);
  console.log('测试数据已存储到localStorage，可在下次生成故事时使用');
}

/**
 * 从localStorage中获取故事问题数据
 * 如果不存在或为空，则返回null
 * 
 * @returns {Array|null} - 故事问题数组或null
 */
export function getStoryQuestionsFromStorage() {
  try {
    const data = localStorage.getItem('storyQuestions');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('从localStorage获取故事数据失败:', error);
    return null;
  }
}

/**
 * 从localStorage中获取故事标题
 * 如果不存在，则返回默认标题
 * 
 * @param {string} defaultTitle - 默认标题
 * @returns {string} - 故事标题
 */
export function getStoryTitleFromStorage(defaultTitle = '章同学的故事') {
  const title = localStorage.getItem('storyTitle');
  return title || defaultTitle;
}

// 导入mock数据相关函数
import { mockStoryQuestions, initMockStoryData, clearMockStoryData } from './mockStoryData';

/**
 * 检查是否存在故事数据，如果不存在则尝试使用mock数据
 * 主要用于开发环境，确保始终有数据可用
 * 
 * @param {boolean} forceMock - 是否强制使用mock数据
 * @returns {Array} - 故事问题数组
 */
export function ensureStoryData(forceMock = false) {
  const existingData = getStoryQuestionsFromStorage();
  
  // 如果不存在数据或强制使用mock数据
  if (!existingData || forceMock) {
    console.log('未检测到故事数据或已强制使用mock数据，初始化mock数据');
    return initMockStoryData();
  }
  
  console.log('检测到已有故事数据:', existingData);
  return existingData;
}

// 导出mock相关功能
export { mockStoryQuestions, initMockStoryData, clearMockStoryData }; 