import Link from 'next/link'
import Image from 'next/image'
import { formatter } from '../../../utils/helpers'

export const ProductCard = ({ product }) => {
    const { handle, title } = product.node
    const { altText, url } = product.node.images.edges[0].node
    const price = product.node.priceRange.minVariantPrice.amount
    return (
        <Link href={`/store/${handle}`}>
            <a className="group border border-black p-2">
                <div className='w-full bg-white'>
                    <div className='relative group-hover:opacity-75 h-72'>
                        <Image
                            src={url}
                            alt={altText}
                            layout="fill"
                            objectFit="cover"
                            priority={true}
                        />
                    </div>
                </div>
                <h3 className='mt-4 text-lg font-medium font-chivo-mono text-gray-900'>{title}</h3>
                <p className='mt-1 text-sm font-chivo-mono text-gray-700'>{formatter.format(price)}</p>
            </a>
        </Link>
    )
}

export default ProductCard