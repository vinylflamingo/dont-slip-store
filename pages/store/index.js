import Head from 'next/head'
import Image from 'next/image'
import Nav from './../../components/controls/Nav'
import { getProductsInCollection } from '../../lib/shopify'
import ProductList from '../../components/modules/product/ProductList'
import MainLayout from '../../components/layouts/MainLayout'
import FullImageBanner from '../../components/modules/image/FullImageBanner'

export default function Store({ products }) {
    console.log(products)
    return (

        <div className="flex flex-col items-center justify-center">
            <MainLayout>
                <div className='flex flex-col items-center justify-center'>
                    <FullImageBanner />
                    <ProductList products={products} />
                </div>
            </MainLayout>
        </div>
    )
}

export async function getStaticProps() {
    const products = await getProductsInCollection()

    return {
        props: { products },
    }

}
