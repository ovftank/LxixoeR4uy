import {
	faCheck,
	faEye,
	faEyeSlash,
	faTimes,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useState } from 'react';

const Account = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		try {
			if (formData.username === 'admin') {
				setMessage('Không thể đổi mật khẩu của admin');
				setLoading(false);
				return;
			}
			const token = localStorage.getItem('token');
			await axios.post(
				'/api/admin/change-password',
				{
					username: formData.username,
					password: formData.password,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setMessage('Thông tin tài khoản đã được cập nhật');
		} catch (error) {
			console.error('Failed to update account:', error);
			setMessage('Không thể cập nhật thông tin tài khoản');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
				<div className='mb-6 flex items-center gap-3'>
					<FontAwesomeIcon
						icon={faUser}
						className='text-2xl text-gray-600'
					/>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Thông Tin Tài Khoản
					</h1>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-gray-700'
						>
							Tên Đăng Nhập
						</label>
						<input
							type='text'
							id='username'
							name='username'
							value={formData.username}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
							placeholder='Nhập tên đăng nhập'
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
						>
							Mật Khẩu
						</label>
						<div className='relative mt-1'>
							<input
								type={showPassword ? 'text' : 'password'}
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
								placeholder='Nhập mật khẩu'
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-600 hover:text-gray-900'
							>
								<FontAwesomeIcon
									icon={showPassword ? faEyeSlash : faEye}
								/>
							</button>
						</div>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-50'
					>
						{loading ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
					</button>
				</form>

				{message && (
					<div
						className={`mt-4 rounded-md ${
							message.includes('Không thể')
								? 'bg-gray-100'
								: 'bg-gray-50'
						} p-3 ${
							message.includes('Không thể')
								? 'text-gray-700'
								: 'text-gray-600'
						}`}
					>
						<div className='flex items-center gap-2'>
							<FontAwesomeIcon
								icon={
									message.includes('Không thể')
										? faTimes
										: faCheck
								}
								className={
									message.includes('Không thể')
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

export default Account;
