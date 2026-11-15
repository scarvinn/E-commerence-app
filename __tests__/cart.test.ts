import { cartReducer, cartSummary, Cart } from '../src/features/cart/cart';
import { filterProducts, formatPrice } from '../src/features/shop/catalog';

test('adding multiple products gives exact quantities and cent totals', () => {
    let cart: Cart = {};
    for (const id of ['tee', 'tee', 'mug']) {
        cart = cartReducer(cart, { type: 'add', id });
    }
    expect(cartSummary(cart)).toMatchObject({ count: 3, totalCents: 6200 });
    cart = cartReducer(cart, { type: 'decrease', id: 'tee' });
    expect(cartSummary(cart)).toMatchObject({ count: 2, totalCents: 3800 });
    cart = cartReducer(cart, { type: 'remove', id: 'mug' });
    expect(cartSummary(cart)).toMatchObject({ count: 1, totalCents: 2400 });
    expect(cartSummary(cartReducer(cart, { type: 'clear' }))).toEqual({
        items: [],
        count: 0,
        totalCents: 0,
    });
});

test('decreasing the final unit removes a line and unknown IDs are ignored', () => {
    expect(cartReducer({ tee: 1 }, { type: 'decrease', id: 'tee' })).toEqual(
        {},
    );
    expect(cartReducer({}, { type: 'decrease', id: 'tee' })).toEqual({});
    expect(cartReducer({}, { type: 'add', id: 'unknown' })).toEqual({});
});

test('quantities stop at 99', () => {
    expect(cartReducer({ tee: 99 }, { type: 'add', id: 'tee' })).toEqual({
        tee: 99,
    });
});

test('search is trimmed, case insensitive and combined with category', () => {
    expect(
        filterProducts('  MUG ', 'All').map((product) => product.id),
    ).toEqual(['mug']);
    expect(filterProducts('mug', 'Clothing')).toEqual([]);
    expect(filterProducts('', 'Clothing')).toHaveLength(2);
    expect(filterProducts('missing', 'All')).toEqual([]);
    expect(formatPrice(6200)).toBe('$62.00');
});
