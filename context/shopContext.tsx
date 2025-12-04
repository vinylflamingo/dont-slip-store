import { createContext, useState, useEffect, ReactNode } from 'react'
import { createCheckout, updateCheckout } from '../lib/shopify'
import { CartItem, VariantOption } from '../types/shopify'

interface AddToCartItem extends VariantOption {
    // Can be either a full CartItem or a partial one from product selection
}

interface CartContextType {
    cart: CartItem[]
    cartOpen: boolean
    setCartOpen: (open: boolean) => void
    addToCart: (item: AddToCartItem, quantity: number, product: { title: string; handle: string }) => Promise<void>
    checkoutUrl: string
    removeCartItem: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
    cartLoading: boolean
    incrementCartItem: (item: CartItem) => Promise<void>
    decrementCartItem: (item: CartItem) => Promise<void>
    handleCheckout: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
    cart: [],
    cartOpen: false,
    setCartOpen: () => {},
    addToCart: async () => {},
    checkoutUrl: '',
    removeCartItem: async () => {},
    clearCart: async () => {},
    cartLoading: false,
    incrementCartItem: async () => {},
    decrementCartItem: async () => {},
    handleCheckout: async () => {},
})

interface ShopProviderProps {
    children: ReactNode
}

export default function ShopProvider({ children }: ShopProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [cartOpen, setCartOpen] = useState(false)
    const [checkoutId, setCheckoutId] = useState('')
    const [checkoutUrl, setCheckoutUrl] = useState('')
    const [cartLoading, setCartLoading] = useState(false)

    useEffect(() => {
        if (localStorage.checkout_id) {
            const cartObject = JSON.parse(localStorage.checkout_id)

            if (cartObject[0].id) {
                setCart([cartObject[0]])
            } else if (cartObject[0].length > 0) {
                setCart(...[cartObject[0]])
            }

            setCheckoutId(cartObject[1].id)
            setCheckoutUrl(cartObject[1].webUrl)
        }

    }, [])


    async function addToCart(addedItem: AddToCartItem, quantity = 1, product: { title: string; handle: string }) {
        const newItem = { ...addedItem };
        setCartOpen(true);

        if (cart.length === 0) {
            setCart([{ ...newItem, variantQuantity: quantity }]);

            const checkout = await createCheckout(newItem.id, quantity);

            setCheckoutId(checkout.id);
            setCheckoutUrl(checkout.webUrl);

            localStorage.setItem("checkout_id", JSON.stringify([{ ...newItem, variantQuantity: quantity }, checkout]));
        } else {
            let newCart: CartItem[] = [];
            let added = false;

            cart.map(item => {
                if (item.id === newItem.id) {
                    if (item.variantQuantity + quantity > newItem.variantQuantity) {
                        alert('Not enough stock available');
                        return;
                    }
                    item.variantQuantity += quantity;
                    newCart = [...cart];
                    added = true;
                }
            });

            if (!added) {
                newCart = [...cart, { ...newItem, variantQuantity: quantity }];
            }

            setCart(newCart);
            const newCheckout = await updateCheckout(checkoutId, newCart);
            localStorage.setItem("checkout_id", JSON.stringify([newCart, newCheckout]));
        }
    }


    async function removeCartItem(itemToRemove: string) {
        const updatedCart = cart.filter(item => item.id !== itemToRemove)
        setCartLoading(true)
        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem("checkout_id", JSON.stringify([updatedCart, newCheckout]))
        setCartLoading(false)

        if (cart.length === 1) {
            setCartOpen(false)
        }
    }

    async function incrementCartItem(item: CartItem) {
        setCartLoading(true)

        let newCart: CartItem[] = []

        cart.map(cartItem => {
            if (cartItem.id === item.id) {
                cartItem.variantQuantity++
                newCart = [...cart]
            }
        })
        setCart(newCart)
        const newCheckout = await updateCheckout(checkoutId, newCart)

        localStorage.setItem("checkout_id", JSON.stringify([newCart, newCheckout]))
        setCartLoading(false)
    }

    async function decrementCartItem(item: CartItem) {
        setCartLoading(true)

        if (item.variantQuantity === 1) {
            removeCartItem(item.id)
        } else {
            let newCart: CartItem[] = []
            cart.map(cartItem => {
                if (cartItem.id === item.id) {
                    cartItem.variantQuantity--
                    newCart = [...cart]
                }
            })

            setCart(newCart)
            const newCheckout = await updateCheckout(checkoutId, newCart)

            localStorage.setItem("checkout_id", JSON.stringify([newCart, newCheckout]))
        }
        setCartLoading(false)
    }

    async function clearCart() {
        const updatedCart: CartItem[] = []

        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem("checkout_id", JSON.stringify([updatedCart, newCheckout]))

    }

    async function handleCheckout() {
        // Extract and save the checkout data from local storage
        const checkoutData = JSON.parse(localStorage.getItem('checkout_id') || '[]');

        // Clear the current cart context
        setCart([]);
        setCheckoutId('');
        setCheckoutUrl('');
        localStorage.removeItem('checkout_id');

        // Use the saved checkout data to redirect
        if (checkoutData && checkoutData[1] && checkoutData[1].webUrl) {
            window.location.href = checkoutData[1].webUrl;
        } else {
            console.error('No valid checkout URL found.');
        }
    }


    return (
        <CartContext.Provider value={{
            cart,
            cartOpen,
            setCartOpen,
            addToCart,
            checkoutUrl,
            removeCartItem,
            clearCart,
            cartLoading,
            incrementCartItem,
            decrementCartItem,
            handleCheckout
        }}>
            {children}
        </CartContext.Provider>
    )
}

const ShopConsumer = CartContext.Consumer

export { ShopConsumer, CartContext }
