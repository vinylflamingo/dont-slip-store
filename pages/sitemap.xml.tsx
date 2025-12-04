import { getAllProducts } from '../lib/shopify';
import type { GetServerSideProps } from 'next';
import { ShopifyProductHandle } from '../types/shopify';

function generateSiteMap(products: ShopifyProductHandle[]) {
  const baseUrl = 'https://dontslipjustdrip.com';

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>

     <!-- Store Index -->
     <url>
       <loc>${baseUrl}/store</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- Product Pages -->
     ${products
       .map((product) => {
         return `
       <url>
         <loc>${baseUrl}/store/${product.node.handle}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>weekly</changefreq>
         <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Fetch all products from Shopify
  const products = await getAllProducts();

  // Generate the XML sitemap
  const sitemap = generateSiteMap(products);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  // This component doesn't render anything
  return null;
}
