import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  // Export your app as a static site
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
  // You can optionally customize more settings here
  images: {
    unoptimized: true, // If you're having issues with image optimization
  },
};

export default nextConfig;
