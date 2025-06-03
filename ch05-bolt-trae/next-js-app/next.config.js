/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除环境变量暴露配置，确保API密钥不会被打包到客户端
  // env: {
  //   NEXT_PUBLIC_DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  // },
};

module.exports = nextConfig;
