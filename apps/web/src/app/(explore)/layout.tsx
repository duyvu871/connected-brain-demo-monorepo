import "@/app/globals.css";
import "@repo/ui/styles.css";
import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import {cn} from "@repo/utils";
import WebVitals from '@/app/_components/web-vitals.tsx';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const fontSans = FontSans({
	subsets: ['latin', 'vietnamese'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: "Connected Brain",
	description: "A platform for connecting brain to handle native language processing",
	generator: 'Connected Brain',
	applicationName: 'Connected Brain',
	referrer: 'origin-when-cross-origin',
	keywords: ['connected-brain', 'connected', 'brain'],
	authors: [{ name: 'DuBui' }, { name: 'Du', url: 'connectedbrain.com.vn' }],
	creator: 'BuiDu',
	publisher: 'BuiDu',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	// metadataBase: new URL("./public/graphics/feature_1.png"),
};

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
			<body className={cn(fontSans.className, "")}>
				<WebVitals />
				{children}
			</body>
		</html>
	);
}
