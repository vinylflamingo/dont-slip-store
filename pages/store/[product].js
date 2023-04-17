import MainLayout from "../../components/layouts/MainLayout";
import ProductPageContent from "../../components/modules/product/ProductPageContent";
import { getAllProducts, getProduct } from "../../lib/shopify"

export default function ProductPage({ product }) {
  return (
    <MainLayout>
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
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.product)

  return {
    props: {
      product
    }
  }
}
