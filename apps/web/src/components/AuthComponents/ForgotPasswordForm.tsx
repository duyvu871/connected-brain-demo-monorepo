'use client';
import type { ContainerProps} from '@mantine/core';
import {
	Anchor,
	Box,
	Button,
	Center,
	Container,
	Group,
	Paper,
	rem,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';

export function ForgotPasswordForm(props: ContainerProps) {
	const router = useRouter();

	const backToLogin = () => {
		router.push('/auth/method?type=login');
	};

	return (
		<Container my={30} size={460} {...props}>
			<Title className="text-3xl font-bold" ta="center">
				Forgot your password?
			</Title>
			<Text c="dimmed" fz="sm" ta="center">
				Enter your email to get a reset link
			</Text>

			<Paper mt="xl" p={30} radius="md" shadow="md" withBorder>
				<TextInput label="Your email" placeholder="contract@connectedbrain.com" required />
				<Group className="flex-col-reverse" justify="space-between" mt="lg">
					<Anchor c="dimmed" className=" w-full text-center " onClick={backToLogin} size="sm">
						<Center className="hover:text-white" inline>
							<IoIosArrowRoundBack stroke={1.5.toString()} style={{ width: rem(18), height: rem(18) }} />
							<Box ml={5}>Back to the login page</Box>
						</Center>
					</Anchor>
					<Button className="w-full text-center">Reset password</Button>
				</Group>
			</Paper>
		</Container>
	);
}