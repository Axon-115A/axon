import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button, TextInput, rem } from '@mantine/core';
// import { IconAt, IconLock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

interface Props {
	opened: boolean,
	onClose: () => void;
	onConfirm: (email: string, password: string) => void;
}


const SignInModal: React.FC<Props> = ({ opened, onClose, onConfirm }) => {
	// const emailIcon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	// const passIcon = <IconLock style={{ width: rem(16), height: rem(16) }} />;

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
          size="lg"
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
          <h2 style={{ textAlign: 'center' }}>Sign In</h2>
          <TextInput
            // leftSectionPointerEvents="none"
            // leftSection={emailIcon}
            label="Email"
            placeholder="user@example.com"
            key={signUpForm.key('email')}
            {...signUpForm.getInputProps('email')}
          />
          <TextInput
            type="password"
            mt="md"
            // rightSectionPointerEvents="none"
            // leftSection={passIcon}
            label="Password"
            placeholder="********"
            key={signUpForm.key('password')}
            {...signUpForm.getInputProps('password')}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: '1rem' }}>
            <Button color="gray" onClick={onClose} style={{ marginRight: '2rem', width: '20%', height: '40px' }}>
              Cancel
            </Button>
            <Button type="submit" style={{ width: '20%', height: '40px' }}>
              Continue
            </Button>
          </div>
        
        </form>
      </Modal>
    </>
  );
}

export default SignInModal;