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
};

export default nextConfig;
