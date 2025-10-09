import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all external URLs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Remove invalid keys like allowedDevOrigins
};

export default nextConfig;
