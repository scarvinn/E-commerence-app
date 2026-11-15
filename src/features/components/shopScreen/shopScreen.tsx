import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    categories,
    Category,
    filterProducts,
    formatPrice,
} from '../../shop/catalog';
import { shopStyles as styles } from '../../shop/styles';
import { useCart } from '../../cart/CartContext';
export const ShopScreen = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<Category>('All');
    const { items, count, dispatch } = useCart();
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <FlatList
                data={filterProducts(query, category)}
                keyExtractor={(product) => product.id}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View style={styles.card}>
                        <Text style={styles.title}>Find your everyday</Text>
                        <Text style={styles.subtitle}>
                            Demo collection · USD · {count} items in cart
                        </Text>
                        <TextInput
                            accessibilityLabel="Search products"
                            placeholder="Search products"
                            placeholderTextColor="#526078"
                            value={query}
                            onChangeText={setQuery}
                            style={styles.search}
                        />
                        <View style={styles.filters}>
                            {categories.map((value) => (
                                <Pressable
                                    key={value}
                                    accessibilityLabel={`Filter ${value}`}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected: category === value,
                                    }}
                                    onPress={() => setCategory(value)}
                                    style={[
                                        styles.chip,
                                        category === value && styles.selected,
                                    ]}>
                                    <Text
                                        style={[
                                            styles.chipText,
                                            category === value &&
                                                styles.selectedText,
                                        ]}>
                                        {value}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.subtitle}>
                        No products found. Try another search or category.
                    </Text>
                }
                renderItem={({ item }) => {
                    const quantity =
                        items.find((entry) => entry.product.id === item.id)
                            ?.quantity ?? 0;
                    return (
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <Text
                                    style={styles.symbol}
                                    accessibilityElementsHidden>
                                    {item.symbol}
                                </Text>
                                <View style={styles.grow}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.subtitle}>
                                        {item.category}
                                    </Text>
                                </View>
                                <Text style={styles.price}>
                                    {formatPrice(item.priceCents)}
                                </Text>
                            </View>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Add ${item.name} to cart`}
                                disabled={quantity >= 99}
                                style={[
                                    styles.button,
                                    quantity >= 99 && styles.disabled,
                                ]}
                                onPress={() =>
                                    dispatch({ type: 'add', id: item.id })
                                }>
                                <Text style={styles.buttonText}>
                                    {quantity >= 99
                                        ? 'Limit reached'
                                        : quantity
                                        ? `Add another · ${quantity} in cart`
                                        : 'Add to cart'}
                                </Text>
                            </Pressable>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};
