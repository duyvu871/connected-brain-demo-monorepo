'use client';
import { upperFirst } from '@mantine/hooks';
// import { useForm } from '@mantine/form';
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
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterFormType } from '@/types/form.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/zod/userValidate';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';

export function RegisterForm(props: PaperProps) {
	const router = useRouter();
	const { register } = useAuth();
	const {
		resetField,
		getValues,
		handleSubmit,
		formState,
		setValue,
		setError,
	} = useForm<RegisterFormType>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = () => {
		return handleSubmit((value) => {
			register(value, '/auth/method?type=login');
			console.log(value);
		}, (errors) => {
			console.log(errors);
		});
	};

	const resetAllField = useCallback(() => {
		resetField('username');
		resetField('phone');
		resetField('email');
		resetField('password');
		resetField('confirmPassword');
	}, [resetField]);

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

	useEffect(() => {
		resetAllField();
	}, [resetAllField]);

	return (
		<Paper p="xl" radius="md" withBorder {...props}>
			<Text fw={500} size="lg">
				Welcome to <span className="text-xl text-blue-400 cursor-pointer hover:underline" onClick={backToMain}>Connected Brain</span>,
				Register with
			</Text>

			<Group grow mb="md" mt="md">
				<GoogleButton className="bg-opacity-0" radius="xl">Google</GoogleButton>
			</Group>

			<Divider label="Or continue with email" labelPosition="center" my="lg" />

			<form onSubmit={onSubmit()}>
				<Stack>
					<TextInput
						autoComplete="off"
						error={formState.errors?.username?.message}
						label="Name"
						onChange={(event) => setValue('username', event.currentTarget.value)}
						placeholder="Your name"
						radius="md"
						spellCheck={false}
					/>
					<TextInput
						autoComplete="off"
						error={formState.errors?.phone?.message}
						label="phone"
						onChange={(event) => setValue('phone', event.currentTarget.value)}
						placeholder="contract@connectedbrain.com"
						radius="md"
						required
						spellCheck={false}
					/>
					<TextInput
						autoComplete="off"
						error={formState.errors?.email?.message}
						label="Email"
						onChange={(event) => setValue('email', event.currentTarget.value)}
						placeholder="contract@connectedbrain.com"
						radius="md"
						required
						spellCheck={false}
					/>
					<PasswordInput
						error={formState.errors?.password?.message}
						label="Password"
						onChange={(event) => setValue('password', event.currentTarget.value)}
						placeholder="Your password"
						radius="md"
						required
					/>
					<PasswordInput
						error={formState.errors?.confirmPassword?.message}
						label="Confirm password"
						onChange={(event) => setValue('confirmPassword', event.currentTarget.value)}
						placeholder="Confirm password"
						radius="md"
						required
					/>
					<Checkbox
						label="I accept terms and conditions"
						// checked={}
						// onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
					/>
				</Stack>
				<Group justify="space-between" mt="xl">
					<Anchor c="dimmed" component="button" onClick={handleLogin} size="xs" type="button">
						Already have an account? Login
					</Anchor>
					<Button radius="md" type="submit">
						{upperFirst('register')}
					</Button>
				</Group>
			</form>
		</Paper>
	);
}