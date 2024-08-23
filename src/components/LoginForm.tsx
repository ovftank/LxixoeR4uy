import React, { useState } from 'react';
import useFormValidation from '@hooks/useFormValidation';
import { useOutletContext } from 'react-router-dom';

type FieldName = 'email' | 'password';

type ContextType = {
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	emailInputRef: React.RefObject<HTMLInputElement>;
	passwordInputRef: React.RefObject<HTMLInputElement>;
};

const LoginForm: React.FC = () => {
	const [formData, setFormData] = useState<{
		email: string;
		password: string;
	}>({
		email: '',
		password: '',
	});
	const { errors, validateInput } = useFormValidation();
	const { setEmail, setPassword, emailInputRef, passwordInputRef } =
		useOutletContext<ContextType>();

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		field: FieldName,
	) => {
		const value = event.target.value;
		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
		if (field === 'email') {
			setEmail(value);
		} else if (field === 'password') {
			setPassword(value);
		}
		validateInput(field, value);
	};

	const handleChange =
		(field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) => {
			handleInputChange(event, field);
		};

	return (
		<div className='my-5'>
			<input
				ref={emailInputRef}
				className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
				type='email'
				placeholder='Email'
				value={formData.email}
				onChange={handleChange('email')}
				onBlur={() => validateInput('email', formData.email)}
			/>
			{errors.email && <p className='text-red-500'>{errors.email}</p>}

			<input
				ref={passwordInputRef}
				className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
				type='password'
				placeholder='Password'
				value={formData.password}
				onChange={handleChange('password')}
				onBlur={() => validateInput('password', formData.password)}
			/>
			{errors.password && (
				<p className='text-red-500'>{errors.password}</p>
			)}
		</div>
	);
};

export default LoginForm;
