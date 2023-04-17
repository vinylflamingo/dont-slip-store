import Link from 'next/link'
import { useContext } from 'react'
import { CartContext } from '../../context/shopContext'
import MiniCart from '../modules/store/MiniCart'

export default function Nav() {
    const { cart, cartOpen, setCartOpen } = useContext(CartContext)

    let cartQuantity = 0
    cart.map(item => {
        return (cartQuantity += item?.variantQuantity)
    })

    return (
        <nav className="border border-black max-w-[1266px] w-full mx-2 sticky top-2 z-20 bg-white font-chivo-mono">
            <div className="flex items-center justify-between max-w-6xl py-3 px-4 mx-auto lg:max-w-screen-xl">
                <Link href="/" passHref>
                    <a className="cursor-pointer">
                        <span className="text-sm md:text-lg pt-1">
                            Don&apos;t Slip Just Drip
                        </span>
                    </a>
                </Link>
                <a
                    className="text-sm md:text-md cursor-pointer"
                    onClick={() => setCartOpen(!cartOpen)}
                >
                    Cart ({cartQuantity})
                </a>
                <MiniCart cart={cart} />
            </div>
        </nav>
    )
}