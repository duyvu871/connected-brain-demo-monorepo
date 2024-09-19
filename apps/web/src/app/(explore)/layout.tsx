
import "@/app/globals.css";
import "@repo/ui/styles.css";
import '@mantine/core/styles.css';
import { Inter as FontSans } from "next/font/google";
import {cn} from "@repo/utils";
import WebVitals from '@/app/_components/web-vitals.tsx';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ThemeProvider } from "@/layouts/global-theme";

const fontSans = FontSans({
	subsets: ['latin', 'vietnamese'],
	variable: '--font-sans',
});


export default async function RootLayout({
																		 children,
																	 }: {
	children: React.ReactNode;
}) {
	const session = await getServerAuthSession();
	const header = headers();
	const pathname = header.get('x-pathname');

	if (!session?.user) {
		return redirect('/auth/method?type=login');
	}
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(fontSans.className, "font-sans antialiased dark:bg-black bg-white")}>
				<WebVitals />
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
