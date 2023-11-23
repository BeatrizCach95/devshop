
import { createContext, ReactNode, useState } from "react"

import { ProductProps } from "../pages/home"

interface CartProps {
    id: string;
    title: string;
    description: string;
    price: number;
    cover: string;
    qtdEstoque: number;
    amount: number;
    total: number;
}

interface CartContextData {
    cart: CartProps[];
    cartAmount: number;
    addCartItem: (newItem: ProductProps) => void;
    removeCartItem: (product: CartProps) => void;
    removeAllCart: () => void;
    total: string;
}

interface CartProviderProps {
    children: ReactNode;
}

export const CartContext = createContext({} as CartContextData)

function CartProvider({ children }: CartProviderProps) {

    const [cart, setCart] = useState<CartProps[]>([])
    const [total, setTotal] = useState('')

    function addCartItem(newItem: ProductProps) {

        const indexItem = cart.findIndex(item => item.id === newItem.id)

        if(indexItem !== -1) {  // Item existe na lista
            const cartList = cart

            cartList[indexItem].amount = cartList[indexItem].amount + 1
            cartList[indexItem].total = cartList[indexItem].amount * cartList[indexItem].price

            setCart(cartList)

            totalResultCart(cartList)

            return
        }

        // Adicionando item a lista
        const data = {
            ...newItem,
            amount: 1,
            total: newItem.price
        }

        setCart(products => [...products, data])

        totalResultCart([...cart, data])
    }

    function removeCartItem(product: CartProps) {

        const indexItem = cart.findIndex(item => item.id === product.id)

        if(cart[indexItem]?.amount > 1) {
            const cartList = cart

            cartList[indexItem].amount = cartList[indexItem].amount - 1
            cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price

            setCart(cartList)

            totalResultCart(cartList)

            return
        }

        const removedItem = cart.filter(item => item.id !== product.id)

        setCart(removedItem)

        totalResultCart(removedItem)

    }

    function removeAllCart() {

        setCart([])

        setTotal('')

    }

    function totalResultCart(items: CartProps[]) {

        const myCarts = items

        const result = myCarts.reduce((acc, obj) => { return acc + obj.total }, 0)

        const reesultFormated = result.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

        setTotal(reesultFormated)
    }

    return (
        <CartContext.Provider value={{ 
            cart, 
            cartAmount: cart.length,
            addCartItem,
            removeCartItem,
            removeAllCart,
            total
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider