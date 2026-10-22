import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // No dependency on a host image service.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    mcpServer: true,
    turbopackFileSystemCacheForBuild: true,
    turbopackGc: true,
    turbopackLazyDynamicImports: true,
    turbopackRustReactCompiler: true,
    typedEnv: true,
  },
  logging: {
    browserToTerminal: "warn",
  },
  typedRoutes: true,
  // Agents that send Accept: text/markdown get Markdown instead of HTML.
  async rewrites() {
    const acceptsMarkdown = [
      {
        type: "header" as const,
        key: "accept",
        value: "(.*)text/markdown(.*)",
      },
    ];
    return {
      beforeFiles: [
        { source: "/", destination: "/md", has: acceptsMarkdown },
        {
          source: "/google-maps-timeline-alternative",
          destination: "/md/google-maps-timeline-alternative",
          has: acceptsMarkdown,
        },
        {
          source: "/arc-timeline-alternative",
          destination: "/md/arc-timeline-alternative",
          has: acceptsMarkdown,
        },
      ],
      afterFiles: [],
      // Fallback rewrites run only when no page or file matches.
      fallback: [
        {
          source: "/:path*",
          destination: "/md/not-found",
          has: acceptsMarkdown,
        },
      ],
    };
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
