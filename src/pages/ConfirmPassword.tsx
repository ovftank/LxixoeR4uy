import useFormValidation from '@hooks/useFormValidation';
import getConfig from '@utils/config';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
type ContextType = {
	setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
	confirmPasswordInputRef: React.RefObject<HTMLInputElement>;
	isLoading: boolean;
	failedPasswordAttempts: number;
};
const ConfirmPassword: React.FC = () => {
	const [password, setPassword] = useState('');
	const { errors, validateInput } = useFormValidation();
	const [isFailed, setIsFailed] = useState(false);
	const {
		setConfirmPassword,
		confirmPasswordInputRef,
		isLoading,
		failedPasswordAttempts,
	} = useOutletContext<ContextType>();
	const handlePasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setIsFailed(false);
		setConfirmPassword(event.target.value);
		setPassword(event.target.value);
	};

	const handleBlur = () => {
		validateInput('password', password);
	};

	useEffect(() => {
		const checkFailedAttempts = async () => {
			const maxAttempts = (await getConfig()).settings.max_pass_attempts;
			if (failedPasswordAttempts >= maxAttempts && !isLoading) {
				setPassword('');
				setIsFailed(true);
			} else if (isLoading === false) {
				setIsFailed(false);
			}
		};
		checkFailedAttempts();
	}, [isLoading, failedPasswordAttempts]);

	return (
		<div className='my-2'>
			<input
				ref={confirmPasswordInputRef}
				className='w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
				type='password'
				placeholder='Password'
				value={password}
				onChange={handlePasswordChange}
				onBlur={handleBlur}
			/>
			{errors.password && (
				<p className='text-red-500'>{errors.password}</p>
			)}

			{isFailed && (
				<p className='text-red-500'>
					The password that you've entered is incorrect.
				</p>
			)}
		</div>
	);
};

export default ConfirmPassword;
