/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        // Add any turbo loaders here if needed
      }
    }
  },
  
  // Optimize font display
  optimizeFonts: true,
  
  // Increase font loading timeout
  fontLoaderOptions: {
    timeout: 60000,
  },
  
  // 配置允许的图片域名
  images: {
    domains: [
      's.coze.cn',     // 允许从s.coze.cn域名加载图片
      'coze.cn',       // 添加基本域名以防万一
      'localhost',     // 允许本地开发环境
      '127.0.0.1'      // 允许本地开发环境
    ],
    // 为减少图片加载失败的情况，添加更多配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 图片缓存时间（秒）
  },
};

export default nextConfig;
