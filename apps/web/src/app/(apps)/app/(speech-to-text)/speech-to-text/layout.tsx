"use client";
import "@/app/globals.css";
import "@repo/ui/styles.css";
import '@mantine/core/styles.css';
import { Inter as FontSans } from "next/font/google";
import {cn} from "@repo/utils";
import { ThemeProvider } from '@/layouts/global-theme.tsx';

const fontSans = FontSans({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-sans',
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}): JSX.Element {
    // const [theme] = useAtom(storageTheme);
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
              fontSans.className,
              "flex justify-center items-center w-full min-h-screen h-fit font-sans antialiased bg-[#0c0d0f]",
            )}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
                {children}
            </ThemeProvider>
            </body>
        </html>
    );
}
