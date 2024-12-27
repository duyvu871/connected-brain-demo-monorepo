"use client"
import HomePage from "@/containers/HomePage/index.tsx";
import LandingLayout from "@/providers/landing-provider";
import NextAuthSessionProviders from '@/providers/auth/NextAuthSessionProviders.tsx';
import { MantineProviderClient } from "@/providers/mantine-provider";

export default function Page(): JSX.Element {
  return (
    <NextAuthSessionProviders>
      <LandingLayout>
        <HomePage />
      </LandingLayout>
    </NextAuthSessionProviders>
  );
}
