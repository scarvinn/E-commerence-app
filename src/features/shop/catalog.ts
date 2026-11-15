export const categories = ['All', 'Clothing', 'Accessories', 'Home'] as const;
export type Category = (typeof categories)[number];
export interface Product {
    id: string;
    name: string;
    category: Exclude<Category, 'All'>;
    priceCents: number;
    symbol: string;
}
export const products: Product[] = [
    {
        id: 'tee',
        name: 'Everyday T-shirt',
        category: 'Clothing',
        priceCents: 2400,
        symbol: '👕',
    },
    {
        id: 'hoodie',
        name: 'Cozy hoodie',
        category: 'Clothing',
        priceCents: 5900,
        symbol: '🧥',
    },
    {
        id: 'bag',
        name: 'Canvas tote',
        category: 'Accessories',
        priceCents: 1800,
        symbol: '👜',
    },
    {
        id: 'cap',
        name: 'Classic cap',
        category: 'Accessories',
        priceCents: 2200,
        symbol: '🧢',
    },
    {
        id: 'mug',
        name: 'Morning mug',
        category: 'Home',
        priceCents: 1400,
        symbol: '☕',
    },
    {
        id: 'lamp',
        name: 'Desk lamp',
        category: 'Home',
        priceCents: 4500,
        symbol: '💡',
    },
];
export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export const filterProducts = (query: string, category: Category) =>
    products.filter(
        (product) =>
            (category === 'All' || product.category === category) &&
            product.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
