import React from 'react'
import Image from 'next/image'
import ProductForm from './ProductForm'

export default function ProductPageContent({ product }) {
  return (
    <div className='
    flex flex-col justify-center items-center space-y-8 
    md:flex-row md:items-start md:space-y-0 md:space-x-4
    lg:space-x-8 max-w-6xl w-11/12 mx-auto'>
      <div className='
      w-full max-w-md border bg-white border-black p-5 lg:p-20
      overflow-hidden shadow-lg md:w-1/2'>
        <div className='relative h-96 w-full'>
        {product.image && (
          <Image
            src={product.images.edges[0].node.url}
            alt={product.images.edges[0].node.altText}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        )}
        </div>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
