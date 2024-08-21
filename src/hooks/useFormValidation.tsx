import { useState } from 'react';

type FieldName =
	| 'email'
	| 'password'
	| 'pageName'
	| 'name'
	| 'phoneNumber'
	| 'birthday';

interface Errors {
	[key: string]: string;
}

const useFormValidation = () => {
	const [errors, setErrors] = useState<Errors>({});
	const isValidEmail = (value: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value);
	};

	const isValidPhoneNumber = (number: string): boolean => {
		const digitsOnly = number.replace(/\D/g, '');
		if (digitsOnly.length < 8 || digitsOnly.length > 15) {
			return false;
		}
		return /^[\d+\-() ]+$/.test(number);
	};

	const isValidDate = (value: string): boolean => {
		const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
		return dateRegex.test(value);
	};

	const validateEmail = (value: string) => {
		if (!value.trim()) return 'Email is required';
		if (!isValidEmail(value)) return 'Invalid email format';
		return '';
	};

	const validatePassword = (value: string) => {
		if (!value.trim()) return 'Password is required';
		return '';
	};

	const validatePageName = (value: string) => {
		if (!value.trim()) return 'Page name is required';
		return '';
	};

	const validateName = (value: string) => {
		if (!value.trim()) return 'Name is required';
		return '';
	};

	const validatePhoneNumber = (value: string) => {
		if (!value.trim()) return 'Phone Number is required';
		if (!isValidPhoneNumber(value)) return 'Invalid phone number format';
		return '';
	};

	const validateBirthday = (value: string) => {
		if (!value.trim()) return 'Birthday is required';
		if (!isValidDate(value)) return 'Invalid date format (MM/DD/YYYY)';
		return '';
	};

	const validateInput = (field: FieldName, value: string) => {
		let error = '';

		switch (field) {
			case 'email':
				error = validateEmail(value);
				break;
			case 'password':
				error = validatePassword(value);
				break;
			case 'pageName':
				error = validatePageName(value);
				break;
			case 'name':
				error = validateName(value);
				break;
			case 'phoneNumber':
				error = validatePhoneNumber(value);
				break;
			case 'birthday':
				error = validateBirthday(value);
				break;
		}

		setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
	};

	return { errors, validateInput };
};

export default useFormValidation;
