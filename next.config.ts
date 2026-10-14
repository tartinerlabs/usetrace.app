import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  partialPrefetching: true,
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
};

const withMDX = createMDX();

export default withMDX(nextConfig);
