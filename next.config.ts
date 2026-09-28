import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles so these win over app/ pages: the landing site lives in
      // public/ and has to be served from the domain root, because its markup
      // and its desktop/mobile redirect both use absolute paths (/support.js,
      // /_img/..., /m/).
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/m", destination: "/m/index.html" },
        { source: "/m/", destination: "/m/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    // public/ is served with max-age=0 by default; these two are content-hashed
    // or versioned by hand, so they can be cached hard.
    return [
      {
        source: "/_img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/support.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
