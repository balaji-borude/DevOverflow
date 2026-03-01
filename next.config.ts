import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",  
    ],
  },
};

export default nextConfig;