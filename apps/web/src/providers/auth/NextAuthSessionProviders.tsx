"use client";
import React from 'react';
import {SessionProvider} from 'next-auth/react';

interface NextAuthSessionProvidersProps {
    children?: React.ReactNode;
}

function NextAuthSessionProviders({children}: NextAuthSessionProvidersProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default NextAuthSessionProviders;