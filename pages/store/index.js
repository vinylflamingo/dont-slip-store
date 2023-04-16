import Head from 'next/head'
import Image from 'next/image'
import Nav from './../../components/Nav'
import { getProductsInCollection } from '../../lib/shopify'
import ProductList from '../../components/ProductList'

export default function Store({ products }) {
    console.log(products)
    return (
        <div>
            <Nav />
            <div className='text-3xl'>
                <ProductList products={products} />
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const products = await getProductsInCollection()

    return {
        props: { products },
    }

}
