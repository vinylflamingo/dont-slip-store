import Head from 'next/head'
import Image from 'next/image'
import Nav from './../../components/controls/Nav'
import { getProductsInCollection } from '../../lib/shopify'
import ProductList from '../../components/modules/product/ProductList'
import MainLayout from '../../components/layouts/MainLayout'
import FullImageBanner from '../../components/modules/image/FullImageBanner'
import ThreeDModel from '../../components/modules/3d/ThreeDModel'
import type { GetStaticProps } from 'next'
import { ShopifyProductEdge } from '../../types/shopify'

interface StoreProps {
    products: ShopifyProductEdge[]
}

export default function Store({ products }: StoreProps) {
    return (

        <div className="flex flex-col items-center justify-center">
            <MainLayout>
                <div className='flex flex-col items-center justify-center'>
                    <ThreeDModel color="white" />
                    <ProductList products={products} />
                </div>
            </MainLayout>
        </div>
    )
}

export const getStaticProps: GetStaticProps<StoreProps> = async () => {
    const products = await getProductsInCollection()
    return {
        props: {
            products
        },
        revalidate: 60
    }
}
