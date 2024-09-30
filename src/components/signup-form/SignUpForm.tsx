import InternalWindow from '../internal-window';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/auth.context';
import { FormEvent, useRef, useState, lazy } from 'react';

const Button = lazy(() => import('../button'));
const Alert = lazy(() => import('../alert'));
const Input = lazy(() => import('../input'));

export const SignUpForm = () => {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmationRef = useRef<HTMLInputElement>(null);
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (passwordRef.current?.value !== passwordConfirmationRef.current?.value) {
			return setError('Passwords do not match');
		}

		if (
			nameRef.current?.value &&
			emailRef.current?.value &&
			passwordRef.current?.value
		) {
			try {
				setError('');
				setLoading(true);
				await signup(
					nameRef.current?.value,
					emailRef.current?.value,
					passwordRef.current?.value
				);
				navigate({ to: '/' });
			} catch {
				setError('Failed to crete an account');
			}
			setLoading(false);
		}
	}

	return (
		<InternalWindow title='Sign Up'>
			<form onSubmit={handleSubmit}>
				<Alert shown={!!error} type='error'>
					{error}
				</Alert>
				<Input type='text' id='name' label='Name' ref={nameRef} required />
				<Input type='email' id='email' label='Email' ref={emailRef} required />
				<Input
					type='password'
					id='password'
					label='Password'
					ref={passwordRef}
					required
				/>
				<Input
					type='password'
					id='passwordConfirmation'
					label='Password Confirmation'
					ref={passwordConfirmationRef}
					required
				/>
				<p>
					Have an account? <Link to='/login'>Log In</Link>
				</p>
				<Button mod='wide' type='submit' disabled={loading}>
					Sign Up
				</Button>
			</form>
		</InternalWindow>
	);
};
