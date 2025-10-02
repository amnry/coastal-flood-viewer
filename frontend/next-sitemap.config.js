/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://coastal-flood-viewer.example.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*'],
  additionalPaths: async (config) => [
    await config.transform(config, '/explorer'),
    await config.transform(config, '/flood-mapper'),
    await config.transform(config, '/hurricane-impact'),
    await config.transform(config, '/catalog'),
    await config.transform(config, '/about'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      'https://coastal-flood-viewer.example.org/sitemap.xml',
    ],
  },
};
