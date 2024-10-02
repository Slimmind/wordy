import InternalWindow from '../internal-window';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/auth.context';
import { useState, lazy } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ValidationMessages } from '../../utils/constants';

const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));

type SignUpFormProps = {
	userId: string;
};

export const SignUpForm = ({ userId = '' }: SignUpFormProps) => {
	const { signup, currentUser } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);

	const validationSchema = Yup.object({
		name: Yup.string()
			.required(ValidationMessages.REQUIRED)
			.min(2, ValidationMessages.NAME),
		email: Yup.string()
			.required(ValidationMessages.REQUIRED)
			.email(ValidationMessages.EMAIL),
		password: Yup.string()
			.required(ValidationMessages.REQUIRED)
			.min(8, ValidationMessages.PASSWORD),
		confirmPassword: Yup.string()
			.oneOf(
				[Yup.ref('password'), ''],
				ValidationMessages.PASSWORD_CONFIRMATION
			)
			.required(ValidationMessages.REQUIRED),
	});

	const formik = useFormik({
		initialValues: {
			name: currentUser?.displayName || '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema,
		onSubmit: handleFormSubmit,
	});

	interface FormValues {
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}

	async function handleFormSubmit(
		values: FormValues,
		formikHelpers: FormikHelpers<FormValues>
	) {
		try {
			await signup(values.name, values.email, values.password);
			formikHelpers.resetForm();
			navigate({ to: '/' });
		} catch (err) {
			console.log('Failed to crete an account', err);
		}
		setLoading(false);
	}

	return (
		<InternalWindow title={userId ? 'Update Profile' : 'Sign Up'}>
			<form onSubmit={formik.handleSubmit}>
				<Input
					type='text'
					id='name'
					label='Name'
					name='name'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.name}
					errorMessage={
						formik.touched.name && formik.errors.name ? formik.errors.name : ''
					}
				/>
				<Input
					type='email'
					id='email'
					label='Email'
					name='email'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.email}
					errorMessage={
						formik.touched.email && formik.errors.email
							? formik.errors.email
							: ''
					}
				/>
				<Input
					type='password'
					id='password'
					label='Password'
					name='password'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.password}
					errorMessage={
						formik.touched.password && formik.errors.password
							? formik.errors.password
							: ''
					}
				/>
				<Input
					type='password'
					id='passwordConfirmation'
					label='Password Confirmation'
					name='confirmPassword'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.confirmPassword}
					errorMessage={
						formik.touched.password && formik.errors.confirmPassword
							? formik.errors.confirmPassword
							: ''
					}
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
