import {
	faCheck,
	faCircleInfo,
	faPaperPlane,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';

interface ChatInfo {
	id: number;
	type: 'private' | 'group' | 'supergroup' | 'channel';
	title?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
}

const Telegram = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
	const [formData, setFormData] = useState({
		chat_id: '',
		token: '',
	});

	const fetchConfig = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('/api/admin/config', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const [chat_id, token_value] = response.data;

			const configData = {
				chat_id: chat_id || '',
				token: token_value || '',
			};

			setFormData({
				chat_id: configData.chat_id,
				token: configData.token,
			});
		} catch {
			setMessage('Failed to fetch configuration');
		}
	};

	useEffect(() => {
		fetchConfig();
	}, []);

	const validateTelegramConfig = async (token: string, chatId: string) => {
		if (!token || !chatId) return;

		try {
			const response = await axios.get(
				`https://api.telegram.org/bot${token}/getChat`,
				{ params: { chat_id: chatId } },
			);

			if (response.data.ok) {
				setChatInfo(response.data.result);
				setMessage('Thông tin Telegram hợp lệ');
			}
		} catch {
			setChatInfo(null);
			setMessage('Thông tin Telegram không hợp lệ');
		}
	};

	const debouncedValidate = debounce(validateTelegramConfig, 500);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'token' || name === 'chat_id') {
			debouncedValidate(
				name === 'token' ? value : formData.token,
				name === 'chat_id' ? value : formData.chat_id,
			);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!chatInfo) {
			setMessage('Vui lòng kiểm tra thông tin Telegram');
			return;
		}

		setLoading(true);
		setMessage('');

		try {
			const token = localStorage.getItem('token');
			await axios.post('/api/admin/telegram', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage('Cấu hình Telegram đã được cập nhật');
			fetchConfig();
		} catch {
			setMessage('Không thể cập nhật cấu hình Telegram');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
				<div className='mb-6 flex items-center gap-3'>
					<FontAwesomeIcon
						icon={faPaperPlane}
						className='text-2xl text-gray-600'
					/>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Cấu Hình Telegram
					</h1>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='chat_id'
							className='block text-sm font-medium text-gray-700'
						>
							Chat ID
						</label>
						<input
							type='text'
							id='chat_id'
							name='chat_id'
							value={formData.chat_id}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
							placeholder='Nhập Chat ID Telegram'
						/>
					</div>

					<div>
						<label
							htmlFor='token'
							className='block text-sm font-medium text-gray-700'
						>
							Token Bot
						</label>
						<input
							type='text'
							id='token'
							name='token'
							value={formData.token}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
							placeholder='Nhập Token Bot Telegram'
						/>
					</div>

					{chatInfo && (
						<div className='rounded-md bg-gray-50 p-4'>
							<div className='flex items-center gap-2 text-gray-700'>
								<FontAwesomeIcon icon={faCircleInfo} />
								<span className='font-medium'>
									Thông tin chat:
								</span>
							</div>
							<div className='mt-2 space-y-1 text-sm text-gray-600'>
								<p>ID: {chatInfo.id}</p>
								<p>Loại: {chatInfo.type}</p>
								{chatInfo.title && <p>Tên: {chatInfo.title}</p>}
								{chatInfo.username && (
									<p>
										Username:{' '}
										<a
											href={`https://t.me/${chatInfo.username}`}
											target='_blank'
											className='hover:underline'
										>
											@{chatInfo.username}
										</a>
									</p>
								)}
								{chatInfo.first_name && (
									<p>
										Tên người dùng: {chatInfo.first_name}{' '}
										{chatInfo.last_name}
									</p>
								)}
							</div>
						</div>
					)}

					<button
						type='submit'
						disabled={loading || !chatInfo}
						className='w-full rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-50'
					>
						{loading ? 'Đang cập nhật...' : 'Lưu Cấu Hình'}
					</button>
				</form>

				{message && (
					<div
						className={`mt-4 rounded-md ${
							message.includes('không hợp lệ') ||
							message.includes('Failed')
								? 'bg-gray-100'
								: 'bg-gray-50'
						} p-3 ${
							message.includes('không hợp lệ') ||
							message.includes('Failed')
								? 'text-gray-700'
								: 'text-gray-600'
						}`}
					>
						<div className='flex items-center gap-2'>
							<FontAwesomeIcon
								icon={
									message.includes('không hợp lệ') ||
									message.includes('Failed')
										? faTimes
										: faCheck
								}
								className={
									message.includes('không hợp lệ') ||
									message.includes('Failed')
										? 'text-gray-700'
										: 'text-gray-600'
								}
							/>
							{message}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Telegram;
