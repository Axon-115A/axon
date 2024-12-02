import React from 'react';
import { Modal, Button, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import OauthButtons from './social/OauthButtons';

//so that all Login functions are called as "Login.handleFunction()" for readability
import { Login } from '../../namespaces/Login';

interface Props {
	isOpen: boolean,
	onClose: () => void;
	switchAuthModals: () => void;

	//state functions passed in from App.tsx
	//needed by Login.handleSignUp
	setSession: (value: any) => void;
	setSignUpOpened: (value: any) => void;
}


const SignUpModal: React.FC<Props> = ({ isOpen, onClose, switchAuthModals, setSession, setSignUpOpened}) => {
	//   const emailIcon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	//   const passIcon = <IconLock style={{ width: rem(16), height: rem(16) }} />;

	const signUpForm = useForm({
		initialValues: {
			email: '',
			password: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) =>
				value.length >= 8 ? null : 'Password must be at least 8 characters long',
		},
	});

	return (
		<>
			<Modal
				opened={isOpen}
				onClose={onClose}
				size="sm"
				centered
				withCloseButton={false}
				overlayProps={{
					backgroundOpacity: 0.55,
					blur: 3,
				}}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<form onSubmit={signUpForm.onSubmit((values) => {
					//onConfirm(values.email, values.password);

					Login.handleSignUp(values.email, values.password, setSession, setSignUpOpened);
					// onClose();
				})}>
					<h2 style={{ textAlign: 'center', fontWeight: 'normal' }}>Create Account</h2>
					<OauthButtons onOauthConfirm={(provider: string) => {Login.handleOauthSignIn(provider)}} />
					<TextInput
						//   leftSectionPointerEvents="none"
						//   leftSection={emailIcon}
						label="Email"
						placeholder="user@example.com"
						key={signUpForm.key('email')}
						{...signUpForm.getInputProps('email')}
					/>
					<TextInput
						type="password"
						mt="md"
						//   leftSectionPointerEvents="none"
						//   leftSection={passIcon}
						label="Password"
						placeholder="At least 8 characters long"
						key={signUpForm.key('password')}
						{...signUpForm.getInputProps('password')}
					/>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: '1.5rem', flexDirection: 'column', gap: '0.5rem' }}>
						<Button type="submit" style={{ width: '100%', height: '40px' }}>
							Sign Up
						</Button>
						<Text c="dimmed" td="underline" size="sm" onClick={switchAuthModals}>
							Already have an account? Sign In
						</Text>
					</div>

				</form>
			</Modal>
		</>
	);
}

export default SignUpModal;