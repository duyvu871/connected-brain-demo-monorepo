import React from 'react';
import AuthContainer from '@/components/AuthComponents/AuthContainer';
import { RegisterForm } from '@/components/AuthComponents/RegisterForm';

function Register() {
	return (
		<AuthContainer>
			<RegisterForm className="max-w-sm" />
		</AuthContainer>
	);
}

export default Register;