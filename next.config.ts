import type { NextConfig } from "next";

const nextConfig: NextConfig = {
eslint: {
    // fix - ignore eslint during build 
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
