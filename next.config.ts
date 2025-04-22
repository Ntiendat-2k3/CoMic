import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
  
};

export default nextConfig;
