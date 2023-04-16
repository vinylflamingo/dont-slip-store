import Head from 'next/head'
import Image from 'next/image'
import { getProductsInCollection } from '../lib/shopify'
import ProductList from '../components/ProductList'

export default function Home() {
  return (
    <div className='text-3xl'>
      Hello World.
    </div>
  )
}