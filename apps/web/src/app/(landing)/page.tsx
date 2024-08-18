"use client"
import HomePage from "@/containers/HomePage";
import LandingLayout from "@/providers/landing-provider";
import NextAuthSessionProviders from '@/providers/auth/NextAuthSessionProviders.tsx';

export default function Page(): JSX.Element {
  return (
    <NextAuthSessionProviders>
      <LandingLayout>
        <HomePage />
      </LandingLayout>
    </NextAuthSessionProviders>
  );
}
