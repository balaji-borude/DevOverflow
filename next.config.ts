import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here  --> here next js Image --> Next/Image only loads images from domains you explicitly trust */
  images: {
    domains: ["encrypted-tbn0.gstatic.com"],
  },
};

export default nextConfig;
