import Head from 'next/head';
import MainLayout from "../../components/layouts/MainLayout";
import ProductPageContent from "../../components/modules/product/ProductPageContent";
import { getAllProducts, getProduct } from "../../lib/shopify"

export default function ProductPage({ product }) {
  // Create Product JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.descriptionHtml?.replace(/<[^>]*>/g, '') || product.title,
    image: product.images?.edges[0]?.node.url || '',
    brand: {
      '@type': 'Brand',
      name: 'Don\'t Slip Just Drip'
    },
    offers: {
      '@type': 'Offer',
      url: `https://dontslipjustdrip.com/store/${product.handle}`,
      priceCurrency: 'USD',
      price: product.variants?.edges[0]?.node.priceV2.amount || '0',
      availability: product.totalInventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>{product.title} - Don&apos;t Slip Just Drip</title>
        <meta name="description" content={product.descriptionHtml?.replace(/<[^>]*>/g, '').substring(0, 160) || product.title} />
        <meta property="og:title" content={`${product.title} - Don't Slip Just Drip`} />
        <meta property="og:description" content={product.descriptionHtml?.replace(/<[^>]*>/g, '').substring(0, 160) || product.title} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://dontslipjustdrip.com/store/${product.handle}`} />
        <meta property="og:image" content={product.images?.edges[0]?.node.url || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className="py-12 sm:pt-20 font-chivo-mono">
        <ProductPageContent product={product} />
      </div>
    </MainLayout>
  )
}

export async function getStaticPaths() {

  const products = await getAllProducts();
  const paths = products.map(item => {
    const product = String(item.node.handle)

    return {
      params: {
        product
      }
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.product)

  return {
    props: {
      product
    },
    revalidate: 60
  }
}
