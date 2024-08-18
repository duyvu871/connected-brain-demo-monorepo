import React from 'react';
import AuthContainer from '@/components/AuthComponents/AuthContainer';
import { ForgotPasswordForm } from '@/components/AuthComponents/ForgotPasswordForm';

function ForgotPassword() {
	return (
		<AuthContainer>
			<ForgotPasswordForm className="max-w-sm" />
		</AuthContainer>
	);
}

export default ForgotPassword;