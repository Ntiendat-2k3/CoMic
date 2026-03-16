import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.otruyenapi.com',
      },
      {
        protocol: 'https',
        hostname: 'sv1.otruyencdn.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  }
};

export default nextConfig;
