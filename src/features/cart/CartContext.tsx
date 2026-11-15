import React, { createContext, useContext, useReducer } from 'react';
import { cartReducer, cartSummary, CartAction } from './cart';
interface CartValue extends ReturnType<typeof cartSummary> {
    dispatch: React.Dispatch<CartAction>;
}
const CartContext = createContext<CartValue | undefined>(undefined);
export function CartProvider({ children }: React.PropsWithChildren) {
    const [cart, dispatch] = useReducer(cartReducer, {});
    return (
        <CartContext.Provider value={{ ...cartSummary(cart), dispatch }}>
            {children}
        </CartContext.Provider>
    );
}
export function useCart() {
    const cart = useContext(CartContext);
    if (!cart) {
        throw new Error('useCart must be used inside CartProvider');
    }
    return cart;
}
