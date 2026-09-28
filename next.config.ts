import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles so the landing export wins at "/" regardless of app routes.
      beforeFiles: [
        { source: "/", destination: "/landing/index.html" },
        { source: "/m", destination: "/landing/m/index.html" },
        { source: "/m/", destination: "/landing/m/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
