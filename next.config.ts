import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
