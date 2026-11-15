import React from 'react';
import Renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import App from '../App';

test('renders the welcome screen with a guest shopping entry', async () => {
    let tree!: ReactTestRenderer;
    await act(async () => {
        tree = Renderer.create(<App />);
    });
    const text = tree.root
        .findAllByType(Text)
        .map((node) => node.props.children)
        .flat()
        .join(' ');
    expect(text).toContain('Browse demo shop');
    expect(text).toContain('Shoppe');
    act(() => tree.unmount());
});
