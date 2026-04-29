import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.platform === 'win32' ? 'D:\\yt-dlp\\nextjs-app' : undefined,
  },
};

export default nextConfig;
