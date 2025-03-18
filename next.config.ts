import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
      NEXT_PUBLIC_API_AUTOMATION_SERVER: process.env.NEXT_PUBLIC_API_AUTOMATION_SERVER,
    },
  
};

export default nextConfig;
