import Link from 'next/link'
import Image from 'next/image'
import { formatter } from '../../../utils/helpers'
import { ShopifyProductEdge } from '../../../types/shopify'

interface ProductCardProps {
    product: ShopifyProductEdge
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { handle, title } = product.node
    const { altText = "" , url = "#" } = product?.node?.images?.edges?.[0]?.node || {};
    const price = parseFloat(product.node.priceRange.minVariantPrice.amount)
    return (
        <Link href={`/store/${handle}`} className="group border border-black p-2">
            <div className='w-full bg-white'>
                <div className='relative group-hover:opacity-75 h-72'>
                {url !== "#" && (
                    <Image
                        src={url}
                        alt={altText}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={true}
                    />
                )}
                </div>
            </div>
            <h3 className='mt-4 text-lg font-medium font-chivo-mono text-gray-900'>{title}</h3>
            <p className='mt-1 text-sm font-chivo-mono text-gray-700'>{formatter.format(price)}</p>
        </Link>
    )
}

export default ProductCard
