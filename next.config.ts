import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const createNextConfig = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 24 * 60 * 60,
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.dev',
      },
      {
        protocol: 'https',
        hostname: '**.mangadex.network',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  }
});

export default createNextConfig;
