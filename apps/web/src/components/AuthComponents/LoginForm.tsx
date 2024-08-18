'use client';
import { upperFirst } from '@mantine/hooks';
import type {
	PaperProps} from '@mantine/core';
import {
	Anchor,
	Button,
	Checkbox,
	Divider,
	Group,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/zod/userValidate';
import type { LoginFormType } from '@/types/form.type';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm(props: PaperProps) {
	const searchParams = useSearchParams();
	const direct = searchParams.get('direct');
	const router = useRouter();
	const { login } = useAuth();
	const {
		getValues,
		handleSubmit,
		formState,
		setValue,
		setError,
	} = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = () => {
		// handle form submission
		return handleSubmit((value) => {
			// call login function
			login(value, direct ?? '/explore');
			console.log(value);
		}, (errors) => {
			console.log(errors);
		});
	};

	const backToMain = () => {
		router.push('/');
	};

	const handleLogin = () => {
		router.push('/auth/method?type=login');
	};
	const handleRegister = () => {
		router.push('/auth/method?type=register');
	};
	const handleForgotPassword = () => {
		router.push('/auth/method?type=forgot-password');
	};

	return (
		<Paper p="xl" radius="md" withBorder {...props}>
			<Text fw={500} size="lg">
				Welcome to <span className="text-xl text-blue-400 cursor-pointer hover:underline" onClick={backToMain}>Connected Brain</span>,
				Login with
			</Text>

			<Group grow mb="md" mt="md">
				<GoogleButton className="bg-opacity-0" radius="xl">Google</GoogleButton>
			</Group>

			<Divider label="Or continue with email" labelPosition="center" my="lg" />

			<form onSubmit={onSubmit()}>
				<Stack>
					<TextInput
						error={formState.errors?.email?.message}
						label="Email"
						onChange={(event) => setValue('email', event.currentTarget.value)}
						placeholder="contract@connectedbrain.com"
						radius="md"
						required
					/>

					<PasswordInput
						error={formState.errors?.password?.message}
						label="Password"
						onChange={(event) => setValue('password', event.currentTarget.value)}
						placeholder="Your password"
						radius="md"
						required
					/>

				</Stack>
				<Group justify="space-between" mt="lg">
					<Checkbox label="Remember me" />
					<Anchor component="button" onClick={handleForgotPassword} size="sm">
						Forgot password?
					</Anchor>
				</Group>
				<Group justify="space-between" mt="xl">
					<Anchor c="dimmed" component="button" onClick={handleRegister} size="xs" type="button">
						{'Don\'t have an account? Register'}
					</Anchor>
					<Button radius="md" type="submit">
						{upperFirst('login')}
					</Button>
				</Group>
			</form>
		</Paper>
	);
}