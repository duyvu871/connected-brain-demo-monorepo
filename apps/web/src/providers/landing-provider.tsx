import React from 'react';
import {MantineProviderClient} from "@/providers/mantine-provider.tsx";

interface LandingProviderProps {
    children?: React.ReactNode;
};

function LandingProvider({children}: LandingProviderProps): JSX.Element {
    return (
        <MantineProviderClient>
            {children}
        </MantineProviderClient>
    );
}

export default LandingProvider;