import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    unoptimized: true, // Allow unoptimized images from API routes
  },
};

export default nextConfig;
