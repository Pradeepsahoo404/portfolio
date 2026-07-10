import type { NextConfig } from "next";

const API_PROXY = process.env.API_PROXY_URL ?? "http://localhost:5001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
