const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://guidedjson.com';

const routes = [
    '/',
    '/json-validator',
    '/json-formatter',
    '/json-to-schema',
    '/json-to-typescript',
    '/json-to-form',
    '/json-parser',
    '/json-to-api',
    '/blog',
    '/blog/how-to-convert-json-to-typescript',
    '/blog/best-json-tools-for-developers',
    '/blog/json-schema-explained',
    '/blog/building-apis-with-json-structures'
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
            .map(
                (route) => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
            )
            .join('\n')}
</urlset>
`;

    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap, 'utf8');
    console.log('Sitemap generated automatically!');
}

generateSitemap();
