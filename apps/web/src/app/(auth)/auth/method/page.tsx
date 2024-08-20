import React, { Suspense } from 'react';
import AuthMethodPage from '@/containers/AuthContainers/AuthMethodPage';
import AppProvider from '@/providers/app-provider.tsx';

function Page() {
	return (
		<Suspense>
			<AppProvider>
				<AuthMethodPage />

			</AppProvider>
		</Suspense>
	);
}

export default Page;