import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export for GitHub Pages
  basePath: '/coastal-flood-viewer',  // GitHub repo name as base path
  images: {
    unoptimized: true,  // Required for static export
  },
};

export default nextConfig;
