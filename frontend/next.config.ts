import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export for GitHub Pages
  trailingSlash: true,  // Add trailing slashes to URLs
  images: {
    unoptimized: true,  // Required for static export
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/coastal-flood-viewer' : '',
};

export default nextConfig;
