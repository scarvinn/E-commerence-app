import React from 'react';
import Renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Alert } from 'react-native';
import { Signup } from '../src/features/components/auth/signup/Signup.tsx';
import { ClassicButton } from '../src/common/button/Button.tsx';
import { ClassicTextInput } from '../src/common/textInput/TextInput.tsx';
import { Ava } from '../src/common/avaPicker/AvaPick';
import { signupPost } from '../src/services/axiosFunctions/signupPost';
import { uploadAvatar } from '../src/services/axiosFunctions/uploadAvatar';
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ goBack: mockGoBack }),
}));
jest.mock('../src/services/axiosFunctions/signupPost', () => ({
    signupPost: jest.fn(),
}));
jest.mock('../src/services/axiosFunctions/uploadAvatar', () => ({
    uploadAvatar: jest.fn(),
}));
const register = jest.mocked(signupPost);
const upload = jest.mocked(uploadAvatar);
let tree: ReactTestRenderer;
let alert: jest.SpyInstance;
beforeEach(() => {
    jest.clearAllMocks();
    alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    register.mockResolvedValue({ userid: 42 });
    act(() => {
        tree = Renderer.create(<Signup />);
    });
    act(() => {
        const fields = tree.root.findAllByType(ClassicTextInput);
        fields[0].props.onChangeText('person@example.com');
        fields[1].props.onChangeText('password123');
        fields[2].props.onChangeText('password123');
    });
});
afterEach(() => {
    act(() => tree.unmount());
    alert.mockRestore();
});
async function submit() {
    await act(async () => {
        await tree.root
            .findAllByType(ClassicButton)
            .find((button) => button.props.title === 'Done')!
            .props.onPress();
    });
}
test('registers without an optional avatar and returns to welcome', async () => {
    await submit();
    expect(register).toHaveBeenCalledWith({
        email: 'person@example.com',
        password: 'password123',
    });
    expect(upload).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
        'Account created',
        'You can now log in.',
    );
    expect(mockGoBack).toHaveBeenCalledTimes(1);
});
test('reports avatar failure separately from successful account creation', async () => {
    upload.mockRejectedValueOnce(new Error('offline'));
    act(() =>
        tree.root.findByType(Ava).props.onImageSelect('file:///photo.jpg'),
    );
    await submit();
    expect(upload).toHaveBeenCalledWith({
        userId: '42',
        imageUri: 'file:///photo.jpg',
    });
    expect(alert).toHaveBeenCalledWith(
        'Account created',
        expect.stringContaining('photo could not be uploaded'),
    );
    expect(mockGoBack).toHaveBeenCalledTimes(1);
});
test('rejects a blank password before calling the API', async () => {
    act(() => {
        const fields = tree.root.findAllByType(ClassicTextInput);
        fields[1].props.onChangeText('');
        fields[2].props.onChangeText('');
    });
    await submit();
    expect(register).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Enter a password');
});
