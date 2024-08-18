import React from 'react';
import { LoginForm } from '@/components/AuthComponents/LoginForm';
import AuthContainer from '@/components/AuthComponents/AuthContainer';

function Login() {
	return (
		<AuthContainer>
			<LoginForm className="max-w-sm" />
		</AuthContainer>
	);
}

export default Login;