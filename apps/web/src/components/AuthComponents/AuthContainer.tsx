import React from 'react';

interface AuthContainerProps {
	children: React.ReactNode;
};

function AuthContainer({ children }: AuthContainerProps) {
	return (
		<main
			className="overflow-x-hidden mx-auto h-svh w-full flex justify-center items-center px-4 sm:px-10 md:px-20 lg:px-44">
			{children}
		</main>
	);
}

export default AuthContainer;