import { View, Alert, ActivityIndicator } from 'react-native';
import { ImageBackground, Text } from 'react-native';
import { signupStyles } from './Signup.ts';
import { ClassicTextInput } from '../../../../common/textInput/TextInput.tsx';
import { useState } from 'react';
import { ClassicButton } from '../../../../common/button/Button.tsx';
import { Ava } from '../../../../common/avaPicker/AvaPick.tsx';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupPost } from '../../../../services/axiosFunctions/signupPost.ts';
import axios from 'axios';
import { uploadAvatar } from '../../../../services/axiosFunctions/uploadAvatar.ts';

export const Signup = () => {
    const [email, useEmail] = useState('');
    const [password, usePassword] = useState('');
    const [passwordConfimation, usePasswordConfimation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
    const navigation = useNavigation();
    const activity = (
        <ActivityIndicator
            size="large"
            style={signupStyles.activityIndecs}></ActivityIndicator>
    );
    const validateData = async () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            Alert.alert('Wrong email!');
        } else if (!password.trim()) {
            Alert.alert('Enter a password');
        } else if (password !== passwordConfimation) {
            Alert.alert("Password doesn't match!");
        } else {
            setIsLoading(true);
            try {
                const response = await signupPost({
                    email: email.trim(),
                    password,
                });
                const userId = response.data?.userid ?? response.userid;
                if (selectedAsset) {
                    try {
                        if (userId == null) {
                            throw new Error('Missing user ID');
                        }
                        await uploadAvatar({
                            userId: String(userId),
                            imageUri: selectedAsset,
                        });
                    } catch {
                        Alert.alert(
                            'Account created',
                            'Your photo could not be uploaded. You can still log in.',
                        );
                        navigation.goBack();
                        return;
                    }
                }
                Alert.alert('Account created', 'You can now log in.');
                navigation.goBack();
            } catch (error) {
                if (axios.isAxiosError(error))
                    Alert.alert(
                        'Unexpected error',
                        JSON.stringify(error.response?.data),
                    );
                else Alert.alert('Unexpected error', 'Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <ScrollView style={signupStyles.container}>
            <ImageBackground
                source={require('../../../../assets/bubleBackground.png')}
                resizeMode="stretch"
                style={signupStyles.backImage}>
                <Text style={signupStyles.titleText}>{'Create\nAccount'}</Text>
                <View style={signupStyles.noAvaImage}>
                    <Ava onImageSelect={setSelectedAsset} />
                </View>
            </ImageBackground>
            <View style={signupStyles.bottomView}>
                <ClassicTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={useEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <ClassicTextInput
                    placeholder="Password"
                    textContentType="password"
                    value={password}
                    onChangeText={usePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    isPasswordEye={true}
                />
                <ClassicTextInput
                    placeholder="Confirm password"
                    value={passwordConfimation}
                    onChangeText={usePasswordConfimation}
                    autoCapitalize="none"
                    autoCorrect={false}
                    isPasswordEye={true}
                />
                {isLoading ? (
                    activity
                ) : (
                    <ClassicButton
                        title="Done"
                        customStyle={signupStyles.doneButton}
                        onPress={validateData}></ClassicButton>
                )}

                <ClassicButton
                    title="Cancel"
                    variant="white"
                    customStyle={signupStyles.cancelButton}
                    onPress={() => navigation.goBack()}></ClassicButton>
            </View>
        </ScrollView>
    );
};
