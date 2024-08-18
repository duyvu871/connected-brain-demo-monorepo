'use client';
import React from 'react';
import { createTheme, Loader, MantineProvider } from '@mantine/core';
import RingLoader from '@ui/resource-ui/Loader/ring-loader.tsx';

const theme = createTheme({
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, ring: RingLoader },
                type: 'ring',
            },
        }),
    },
});


interface MantineProviderProps {
    children: React.ReactNode;
}

export function MantineProviderClient({ children }: MantineProviderProps): JSX.Element {
    return (
        <MantineProvider forceColorScheme="dark" theme={theme}>
            {children}
        </MantineProvider>
    );
}

export default MantineProvider;