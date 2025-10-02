/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_TILES_BASE_URL: process.env.NEXT_PUBLIC_TILES_BASE_URL,
    NEXT_PUBLIC_DATA_CATALOG_URL: process.env.NEXT_PUBLIC_DATA_CATALOG_URL,
    NEXT_PUBLIC_ELEVATION_ASSET: process.env.NEXT_PUBLIC_ELEVATION_ASSET,
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://coastal-flood-viewer-api.workers.dev/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
