import { type FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Input from '../input';
import InternalWindow from '../internal-window';
import { Button } from '../button/Button';
import { useAuth } from '../../contexts/auth.context';
import Alert from '../alert';

export const LoginForm = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const emailRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const passwordRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (emailRef.current?.value && passwordRef.current?.value) {
			try {
				setError('');
				await login(emailRef.current?.value, passwordRef.current?.value);
				navigate({ to: '/' });
			} catch {
				setError('Failed to log in');
			}
		}
	}

	if (error) {
		return (
			<Alert shown={!!error} type='error' title='Error!..'>
				{error}
			</Alert>
		);
	}

	return (
		<InternalWindow title='Log In'>
			<form onSubmit={handleSubmit}>
				<Input type='email' id='email' label='Email' ref={emailRef} />
				<Input
					type='password'
					id='password'
					label='Password'
					ref={passwordRef}
				/>
				<p>
					Need an account? <Link to='/signup'>Sign Up</Link>
				</p>
				<Button mod='wide' type='submit'>
					Log In
				</Button>
			</form>
		</InternalWindow>
	);
};
