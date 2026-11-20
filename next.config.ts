import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl && !backendUrl.startsWith('/')) {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl.replace(/\/$/, '')}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
