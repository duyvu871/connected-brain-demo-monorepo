'use client';

import React, { createContext, useLayoutEffect, useState } from 'react';
import type { UserInterface, UserSessionPayload } from 'types/user.type';
import { signIn, signOut, useSession } from 'next-auth/react';
import { APIs, routeList } from '@/global/contants/route';
import { usePathname, useRouter } from 'next/navigation';
import type { StandardResponse } from 'types/api.type';
import { useToast } from '@/hooks/useToast.ts';

type UserRegisterPayload = Pick<UserInterface, 'username' | 'password' | 'email' | 'phone'>;
type UserLoginPayload = Pick<UserInterface, 'email' | 'password'>;

export interface AuthContextProps {
	user: UserInterface | null;
	isLogin: boolean;
	/**
	 *Login helper function for user login with the following payload:
	 *- email: string
	 *- password: string
	 *@Return:
	 *	void
	 *@example
	 *	login({
	 *		email: 'email@example.com',
	 *		password: 'password',
	 *	}, '/');
	 *@param userPayload - UserLoginPayload
	 *@param redirect - string
	 **/
	login: (userPayload: UserLoginPayload, redirect: string) => void;
	/**
	 *Logout helper function for user logout
	 * @param redirect - string (optional) default to home page if not provided (/)
	 * @Return:
	 *	void
	 * @example
	 *	logout();
	 **/
	logout: () => void;
	/**
	 * Registers a user with the provided details.
	 * @param userPayload - UserRegisterPayload
	 * @param redirect
	 * @returns void
	 * @example
	 * register({
	 *   username: 'username',
	 *   password: 'password',
	 *   email: 'email@example.com',
	 *   phone: '0123456789',
	 * });
	 */
	register: (userPayload: UserRegisterPayload, redirect: string) => void;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

const initialValue = {
	user: null,
	isLogin: false,
	login: () => {
	},
	logout: () => {
	},
	register: () => {
	},
};

/**
 *Auth Context for user authentication
 *@Return:
 *React.Context<SidebarContextProps>
 *@example:
 *	const auth = useContext(AuthContext);
 **/
const AuthContext = createContext<AuthContextProps>(initialValue);
/**
 *Auth Provider for user authentication
 *
 *@Return:
 *		 React.FC
 *@example:
 *	<AuthProvider>
 *		<App />
 *	</AuthProvider>
 **/
const AuthProvider = ({ children }: AuthProviderProps) => {
	const toast = useToast();
	const router = useRouter();
	const pathname = usePathname();
	const session = useSession();
	const { data } = session;
	const [user, setUser] = useState<UserInterface | null>(null);
	const [isLogin, setIsLogin] = useState<boolean>(false);

	const login = async (userPayload: UserLoginPayload, redirect: string) => {
		const signInResponse = await signIn('credentials', {
			email: userPayload.email,
			password: userPayload.password,
			role: 'user',
			redirect: false,
			// callbackUrl: redirect,
		});
		console.log(signInResponse);
		if (signInResponse?.status !== 200) {
			toast.error(signInResponse?.error ?? 'Login failed');
			return;
		}
		toast.success('Login success');
		router.push(redirect);
		// setUser(user);
		// setIsLogin(true);
	};

	const logout = async (redirect?: string) => {
		const signOutResponse = await signOut({ redirect: true, callbackUrl: redirect || routeList.home });
		// setUser(null);
		// setIsLogin(false);
	};

	const register = async (userPayload: UserRegisterPayload, redirect: string = routeList.login) => {
		const signInResponse = await fetch(APIs.signUp, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userPayload),
		});
		const JsonParseData: StandardResponse<UserSessionPayload> = await signInResponse.json();
		if (JsonParseData.error) {
			toast.error(JsonParseData.error);
			return;
		}
		toast.success('Register success');
		router.push(redirect || routeList.login);
		// setUser(user);
		// setIsLogin(true);
	};

	useLayoutEffect(() => {
		if (data) {
			if (pathname === routeList.login || pathname === routeList.register) {
				router.push('/');
			}
			setIsLogin(true);
			setUser(data.user);
		} else {
			setIsLogin(false);
			setUser(null);
		}
	}, [pathname, data, router]);


	return (
		<AuthContext.Provider value={{
			user,
			isLogin,
			login,
			logout,
			register,
		}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };