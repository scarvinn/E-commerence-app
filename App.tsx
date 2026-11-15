import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createStaticNavigation } from '@react-navigation/native';

import { CartProvider } from './src/features/cart/CartContext';
import { RootStack } from './src/navigation/navigation.ts';
const Navigation = createStaticNavigation(RootStack);
function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <CartProvider>
                <Navigation />
            </CartProvider>
        </SafeAreaProvider>
    );
}

export default App;
