'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Login from '@/containers/AuthContainers/Login';
import Register from './Register';
import ForgotPassword from '@/containers/AuthContainers/ForgotPassword';


function AuthMethodPage() {
	const searchParams = useSearchParams();
	const methodtype = searchParams.get('type');

	switch (methodtype) {
		case 'login':
			return (
				<Login />
			);
		case 'register':
			return (
				<Register />
			);
		case 'forgot-password':
			return (
				<ForgotPassword />
			);
		default:
			return (
				<Login />
			);
	}
}

export default AuthMethodPage;