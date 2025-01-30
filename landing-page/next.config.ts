import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
