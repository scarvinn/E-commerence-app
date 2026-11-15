import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shopStyles as styles } from '../../shop/styles';
export const ProfileScreen = () => (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
            <Text style={styles.title}>Your space</Text>
            <Text style={styles.subtitle}>
                Welcome to the shopping demo. Browse the Shop tab and build your
                cart.
            </Text>
            <Text style={styles.subtitle}>
                Profile editing and saved orders are coming later.
            </Text>
        </View>
    </SafeAreaView>
);
