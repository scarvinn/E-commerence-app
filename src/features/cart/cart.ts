import { products } from '../shop/catalog';
export type Cart = Record<string, number>;
export type CartAction =
    | { type: 'add' | 'decrease' | 'remove'; id: string }
    | { type: 'clear' };
export function cartReducer(cart: Cart, action: CartAction): Cart {
    if (action.type === 'clear') {
        return {};
    }
    if (!products.some((product) => product.id === action.id)) {
        return cart;
    }
    const next = { ...cart };
    const quantity = cart[action.id] ?? 0;
    if (action.type === 'add') {
        next[action.id] = Math.min(quantity + 1, 99);
    } else if (action.type === 'remove' || quantity <= 1) {
        delete next[action.id];
    } else {
        next[action.id] = quantity - 1;
    }
    return next;
}
export function cartSummary(cart: Cart) {
    const items = products.flatMap((product) =>
        cart[product.id] ? [{ product, quantity: cart[product.id] }] : [],
    );
    return {
        items,
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        totalCents: items.reduce(
            (sum, item) => sum + item.product.priceCents * item.quantity,
            0,
        ),
    };
}
