import React from 'react';
import {MantineProviderClient} from "@/components/Providers/mantine-provider.tsx";

interface LandingLayoutProps {
    children?: React.ReactNode;
};

function LandingLayout({children}: LandingLayoutProps): JSX.Element {
    return (
        <MantineProviderClient>
            {children}
        </MantineProviderClient>
    );
}

export default LandingLayout;