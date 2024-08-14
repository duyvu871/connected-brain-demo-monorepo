"use client"
import HomePage from "@/containers/HomePage";
import LandingLayout from "@/providers/landing-provider";

export default function Page(): JSX.Element {
  return (
      <LandingLayout>
        <HomePage />
      </LandingLayout>
  );
}
