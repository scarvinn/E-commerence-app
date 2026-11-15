import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../cart/CartContext';
import { formatPrice } from '../../shop/catalog';
import { shopStyles as styles } from '../../shop/styles';
export const CartScreen = () => {
    const { items, count, totalCents, dispatch } = useCart();
    const clearCart = () =>
        Alert.alert('Clear cart?', 'Remove all items from your cart?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear cart',
                style: 'destructive',
                onPress: () => dispatch({ type: 'clear' }),
            },
        ]);
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.product.id}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <Text style={styles.title}>Your cart · {count}</Text>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.name}>Your cart is empty</Text>
                        <Text style={styles.subtitle}>
                            Visit the Shop tab to add something you like.
                        </Text>
                    </View>
                }
                renderItem={({ item: { product, quantity } }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {product.symbol} {product.name}
                        </Text>
                        <Text style={styles.subtitle}>
                            {formatPrice(product.priceCents)} each
                        </Text>
                        <View style={styles.row}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Decrease ${product.name} quantity`}
                                style={styles.control}
                                onPress={() =>
                                    dispatch({
                                        type: 'decrease',
                                        id: product.id,
                                    })
                                }>
                                <Text style={styles.name}>−</Text>
                            </Pressable>
                            <Text style={styles.name}>{quantity}</Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Increase ${product.name} quantity`}
                                disabled={quantity >= 99}
                                style={[
                                    styles.control,
                                    quantity >= 99 && styles.disabled,
                                ]}
                                onPress={() =>
                                    dispatch({ type: 'add', id: product.id })
                                }>
                                <Text style={styles.name}>+</Text>
                            </Pressable>
                            <Text style={styles.price}>
                                {formatPrice(product.priceCents * quantity)}
                            </Text>
                        </View>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${product.name}`}
                            style={styles.control}
                            onPress={() =>
                                dispatch({ type: 'remove', id: product.id })
                            }>
                            <Text style={styles.remove}>Remove</Text>
                        </Pressable>
                    </View>
                )}
                ListFooterComponent={
                    count ? (
                        <View style={styles.card}>
                            <Text style={styles.name}>
                                Subtotal: {formatPrice(totalCents)}
                            </Text>
                            <Text style={styles.subtitle}>
                                Demo cart. Shipping, taxes and payments are not
                                connected. Your cart resets when the app
                                restarts.
                            </Text>
                            <Pressable
                                accessibilityRole="button"
                                style={styles.control}
                                accessibilityLabel="Clear cart"
                                onPress={clearCart}>
                                <Text style={styles.remove}>Clear cart</Text>
                            </Pressable>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};
