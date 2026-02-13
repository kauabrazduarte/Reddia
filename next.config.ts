import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "contrib.rocks",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.star-history.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
