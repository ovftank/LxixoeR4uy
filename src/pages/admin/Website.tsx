import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ConfigData {
	code_loading_time: number;
	pass_loading_time: number;
	max_pass_attempts: number;
	max_code_attempts: number;
}

const defaultConfig: ConfigData = {
	code_loading_time: 0,
	pass_loading_time: 0,
	max_pass_attempts: 0,
	max_code_attempts: 0,
};

const Website = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [config, setConfig] = useState<ConfigData>(defaultConfig);

	const fetchConfig = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('/api/admin/config', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const [
				,
				,
				code_loading_time,
				pass_loading_time,
				max_pass_attempts,
				max_code_attempts,
			] = response.data;

			setConfig({
				code_loading_time: Number(code_loading_time) || 0,
				pass_loading_time: Number(pass_loading_time) || 0,
				max_pass_attempts: Number(max_pass_attempts) || 0,
				max_code_attempts: Number(max_code_attempts) || 0,
			});
		} catch {
			setMessage('Failed to fetch configuration');
			setConfig(defaultConfig);
		}
	};

	useEffect(() => {
		fetchConfig();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const token = localStorage.getItem('token');
			await axios.post('/api/admin/config', config, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage('Website configuration has been updated');
			fetchConfig();
		} catch {
			setMessage('Failed to update configuration');
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setConfig((prev) => ({
			...prev,
			[name]: value === '' ? 0 : Math.max(0, parseInt(value) || 0),
		}));
	};

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
				<div className='mb-6 flex items-center gap-3'>
					<FontAwesomeIcon
						icon={faGlobe}
						className='text-2xl text-gray-600'
					/>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Cấu Hình Website
					</h1>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='code_loading_time'
							className='block text-sm font-medium text-gray-700'
						>
							Thời Gian Load Giữa Các Lần Nhập Code (ms)
						</label>
						<input
							type='number'
							id='code_loading_time'
							name='code_loading_time'
							value={config.code_loading_time}
							onChange={handleInputChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
						/>
					</div>

					<div>
						<label
							htmlFor='pass_loading_time'
							className='block text-sm font-medium text-gray-700'
						>
							Thời Gian Load Giữa Các Lần Nhập Mật Khẩu (ms)
						</label>
						<input
							type='number'
							id='pass_loading_time'
							name='pass_loading_time'
							value={config.pass_loading_time}
							onChange={handleInputChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
						/>
					</div>

					<div>
						<label
							htmlFor='max_pass_attempts'
							className='block text-sm font-medium text-gray-700'
						>
							Số Lần Nhập Mật Khẩu Tối Đa
						</label>
						<input
							type='number'
							id='max_pass_attempts'
							name='max_pass_attempts'
							value={config.max_pass_attempts}
							onChange={handleInputChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
						/>
					</div>

					<div>
						<label
							htmlFor='max_code_attempts'
							className='block text-sm font-medium text-gray-700'
						>
							Số Lần Nhập Code Tối Đa
						</label>
						<input
							type='number'
							id='max_code_attempts'
							name='max_code_attempts'
							value={config.max_code_attempts}
							onChange={handleInputChange}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-50'
					>
						{loading ? 'Đang Cập Nhật...' : 'Lưu Cấu Hình'}
					</button>
				</form>

				{message && (
					<div
						className={`mt-4 rounded-md bg-gray-50 p-3 text-gray-600`}
					>
						<div className='flex items-center gap-2'>
							{message ===
							'Website configuration has been updated'
								? 'Cấu hình website đã được cập nhật'
								: message === 'Failed to update configuration'
									? 'Không thể cập nhật cấu hình'
									: message ===
										  'Failed to fetch configuration'
										? 'Không thể tải cấu hình'
										: message}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Website;
