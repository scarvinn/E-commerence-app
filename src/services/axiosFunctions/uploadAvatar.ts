import { Platform } from 'react-native';
import api from './api';

interface uploadAvatarInterface {
    userId: string;
    imageUri: string;
}
export const uploadAvatar = async ({
    userId,
    imageUri,
}: uploadAvatarInterface) => {
    const formData = new FormData();
    const extension = imageUri.split('.').pop()?.toLowerCase();
    const fileToUpload = {
        uri:
            Platform.OS === 'android'
                ? imageUri
                : imageUri.replace('file://', ''),
        type: extension === 'jpg' ? 'image/jpeg' : `image/${extension}`,
        name: `user_${userId}_avatar.${extension}`,
    };
    formData.append('image', fileToUpload as any);
    formData.append('id', userId);

    await api.post('/api/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
