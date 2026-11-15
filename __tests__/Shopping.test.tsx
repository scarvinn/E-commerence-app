import React from 'react';
import Renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Alert, Text, TextInput } from 'react-native';
import { CartProvider } from '../src/features/cart/CartContext';
import { ShopScreen } from '../src/features/components/shopScreen/shopScreen';
import { CartScreen } from '../src/features/components/cartScreen/cartScreen';

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: require('react-native').View,
}));

test('search, filter and shared cart controls update the displayed cart', () => {
    let tree!: ReactTestRenderer;
    act(() => {
        tree = Renderer.create(
            <CartProvider>
                <ShopScreen />
                <CartScreen />
            </CartProvider>,
        );
    });
    const press = (label: string) => {
        const button = tree.root
            .findAll((node) => typeof node.props.onPress === 'function')
            .find((node) => node.props.accessibilityLabel === label);
        expect(button).toBeDefined();
        act(() => button!.props.onPress());
    };
    const text = () =>
        tree.root
            .findAllByType(Text)
            .map((node) => node.props.children)
            .flat()
            .join(' ');
    expect(text()).toContain('Your cart is empty');
    press('Add Everyday T-shirt to cart');
    press('Add Everyday T-shirt to cart');
    expect(text()).toContain('$48.00');
    press('Decrease Everyday T-shirt quantity');
    expect(text()).toContain('$24.00');
    press('Remove Everyday T-shirt');
    expect(text()).toContain('Your cart is empty');
    act(() => tree.root.findByType(TextInput).props.onChangeText('mug'));
    expect(
        tree.root
            .findAll((node) => typeof node.props.onPress === 'function')
            .filter((node) =>
                node.props.accessibilityLabel?.startsWith('Add '),
            ),
    ).toHaveLength(1);
    press('Filter Clothing');
    expect(text()).toContain('No products found.');
    act(() => tree.unmount());
});

test('clearing the cart requires confirmation', () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    let tree!: ReactTestRenderer;
    act(() => {
        tree = Renderer.create(
            <CartProvider>
                <ShopScreen />
                <CartScreen />
            </CartProvider>,
        );
    });
    const button = tree!.root
        .findAll((node) => typeof node.props.onPress === 'function')
        .find(
            (node) =>
                node.props.accessibilityLabel ===
                'Add Everyday T-shirt to cart',
        );
    act(() => button!.props.onPress());
    const clear = tree!.root
        .findAll((node) => typeof node.props.onPress === 'function')
        .find((node) => node.props.accessibilityLabel === 'Clear cart');
    act(() => clear!.props.onPress());
    const options = alert.mock.calls[0][2]!;
    expect(options[0].style).toBe('cancel');
    expect(
        tree!.root
            .findAllByType(Text)
            .map((node) => node.props.children)
            .flat()
            .join(' '),
    ).toContain('$24.00');
    act(() => options[1].onPress!());
    expect(
        tree!.root
            .findAllByType(Text)
            .map((node) => node.props.children)
            .flat()
            .join(' '),
    ).toContain('Your cart is empty');
    act(() => tree!.unmount());
    alert.mockRestore();
});
