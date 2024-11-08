import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button, TextInput, Text, rem } from '@mantine/core';
// import { IconAt, IconLock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { GithubButton } from './social/GithubButton';
import { GoogleButton } from './social/GoogleButton';

interface Props {
    opened: boolean,
    onClose: () => void;
    onConfirm: (email: string, password: string) => void;
    onOauthConfirm: (provider: string) => void;
    onSignIn: () => void;
}


const SignUpModal: React.FC<Props> = ({opened, onClose, onConfirm, onOauthConfirm, onSignIn}) => {
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
          opened={opened}
          onClose={onClose}
          size="sm"
          centered
          withCloseButton={false}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          style = {{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
          }}
      >
        <form onSubmit={signUpForm.onSubmit((values) => {
          onConfirm(values.email, values.password);
          // onClose();
        })}>
          <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column', gap: '0.5rem'}}>
						<GithubButton onClick={() => {onOauthConfirm('github')}}>Sign In With Github</GithubButton>
						<GoogleButton onClick={() => {onOauthConfirm('google')}}>Sign In With Google</GoogleButton>
					</div>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: '1.5rem', flexDirection: 'column', gap: '0.5rem'}}>
						<Button type="submit" style={{ width: '100%', height: '40px' }}>
							Sign Up
						</Button>
						<Text c="dimmed" td="underline" size="sm" onClick={onSignIn}>
							Already have an account? Sign In
						</Text>
					</div>
        
        </form>
      </Modal>
    </>
  );
}
  
export default SignUpModal;