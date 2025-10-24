/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Required for GitHub Pages deployment at /coastal-flood-viewer/
  basePath: process.env.NODE_ENV === 'production' ? '/coastal-flood-viewer' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/coastal-flood-viewer' : '',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_TILES_BASE_URL: process.env.NEXT_PUBLIC_TILES_BASE_URL,
    NEXT_PUBLIC_DATA_CATALOG_URL: process.env.NEXT_PUBLIC_DATA_CATALOG_URL,
    NEXT_PUBLIC_ELEVATION_ASSET: process.env.NEXT_PUBLIC_ELEVATION_ASSET,
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  },
  // Note: rewrites and headers are not supported with static export
  // These will be handled by the hosting platform configuration instead
};

module.exports = nextConfig;
