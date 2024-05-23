import { createContext, useState, useEffect } from 'react'
import { createCheckout, updateCheckout, removeCartItem } from '../lib/shopify'

const CartContext = createContext()

export default function ShopProvider({ children }) {
    const [cart, setCart] = useState([])
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


    async function addToCart(addedItem, quantity = 1, product) {
        const newItem = { ...addedItem };
        setCartOpen(true);
    
        if (cart.length === 0) {
            setCart([{ ...newItem, variantQuantity: quantity }]);
    
            const checkout = await createCheckout(newItem.id, quantity);
    
            setCheckoutId(checkout.id);
            setCheckoutUrl(checkout.webUrl);
    
            localStorage.setItem("checkout_id", JSON.stringify([{ ...newItem, variantQuantity: quantity }, checkout]));
        } else {
            let newCart = [];
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


    async function removeCartItem(itemToRemove) {
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

    async function incrementCartItem(item) {
        setCartLoading(true)

        let newCart = []

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

    async function decrementCartItem(item) {
        setCartLoading(true)

        if (item.variantQuantity === 1) {
            removeCartItem(item.id)
        } else {
            let newCart = []
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
        const updatedCart = []

        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem("checkout_id", JSON.stringify([updatedCart, newCheckout]))

    }

    async function handleCheckout() {
        // Extract and save the checkout data from local storage
        const checkoutData = JSON.parse(localStorage.getItem('checkout_id'));
        
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