import {
	IconAlertCircle,
	IconAlertTriangle,
	IconBell,
	IconBrandTelegram,
	IconCheck,
	IconClock,
	IconDatabase,
	IconDeviceFloppy,
	IconFingerprint,
	IconHourglassHigh,
	IconKey,
	IconLock,
	IconLogout,
	IconMessage,
	IconMoonStars,
	IconSend,
	IconSettings,
	IconShieldLock,
	IconSun,
	IconToggleLeft,
	IconToggleRight,
} from '@tabler/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Config {
	settings: {
		code_loading_time: number;
		max_failed_code_attempts: number;
		max_failed_password_attempts: number;
		page_loading_time: number;
		password_loading_time: number;
		code_input_enabled: boolean;
	};
	telegram: {
		notification_chatid: string;
		notification_token: string;
		data_chatid: string;
		data_token: string;
	};
}

const CustomToggle: React.FC<{
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
	darkMode: boolean;
}> = ({ checked, onChange, label, darkMode }) => {
	return (
		<label className='flex cursor-pointer items-center'>
			<div className='relative'>
				<input
					type='checkbox'
					className='sr-only'
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
				/>
				{checked ? (
					<IconToggleRight
						className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'} transition-colors`}
					/>
				) : (
					<IconToggleLeft
						className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}
					/>
				)}
			</div>
			<div
				className={`ml-3 font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}
			>
				{label}
			</div>
		</label>
	);
};

const AdminConfig: React.FC = () => {
	const [config, setConfig] = useState<Config>({
		settings: {
			code_loading_time: 0,
			max_failed_code_attempts: 0,
			max_failed_password_attempts: 0,
			page_loading_time: 0,
			password_loading_time: 0,
			code_input_enabled: false,
		},
		telegram: {
			notification_chatid: '',
			notification_token: '',
			data_chatid: '',
			data_token: '',
		},
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(false);
	const [activeTab, setActiveTab] = useState('settings');

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const response = await axios.get<Config>('/api/admin/config');
				setConfig(response.data);
			} catch {
				setError('Không thể tải cấu hình');
				navigate('/admin/login');
			}
		};
		fetchConfig();
	}, [navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;
		setConfig((prevConfig) => {
			const [section, field] = name.split('.');
			if (section === 'settings') {
				return {
					...prevConfig,
					settings: {
						...prevConfig.settings,
						[field]: type === 'number' ? Number(value) : value,
					},
				};
			} else if (section === 'telegram') {
				return {
					...prevConfig,
					telegram: {
						...prevConfig.telegram,
						[field]: value,
					},
				};
			}
			return prevConfig;
		});
	};

	const handleCheckboxChange = (checked: boolean) => {
		setConfig((prevConfig) => ({
			...prevConfig,
			settings: {
				...prevConfig.settings,
				code_input_enabled: checked,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('adminToken');
			await axios.post('/api/admin/config', config, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSuccess('Cập nhật cấu hình thành công');
		} catch (error) {
			setError('Không thể cập nhật cấu hình');
			console.error('Error updating config:', error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('adminToken');
		navigate('/admin/login');
	};

	const settingsLabels: {
		[key: string]: { label: string; icon: React.ReactNode };
	} = {
		code_loading_time: {
			label: 'Thời gian load mã (ms)',
			icon: <IconHourglassHigh className='h-5 w-5 text-indigo-500' />,
		},
		max_failed_code_attempts: {
			label: 'Số lần nhập mã sai tối đa',
			icon: <IconAlertTriangle className='h-5 w-5 text-orange-500' />,
		},
		max_failed_password_attempts: {
			label: 'Số lần nhập mật khẩu sai tối đa',
			icon: <IconShieldLock className='h-5 w-5 text-red-500' />,
		},
		page_loading_time: {
			label: 'Thời gian load trang (ms)',
			icon: <IconClock className='h-5 w-5 text-blue-500' />,
		},
		password_loading_time: {
			label: 'Thời gian load mật khẩu (ms)',
			icon: <IconLock className='h-5 w-5 text-purple-500' />,
		},
		code_input_enabled: {
			label: 'Bật nhập mã',
			icon: <IconKey className='h-5 w-5 text-green-500' />,
		},
	};

	const telegramLabels: {
		[key: string]: { label: string; icon: React.ReactNode };
	} = {
		notification_chatid: {
			label: 'ChatID (Thông báo truy cập)',
			icon: <IconMessage className='h-5 w-5 text-blue-500' />,
		},
		notification_token: {
			label: 'Token (Thông báo truy cập)',
			icon: <IconFingerprint className='h-5 w-5 text-indigo-500' />,
		},
		data_chatid: {
			label: 'ChatID (Data trả về)',
			icon: <IconDatabase className='h-5 w-5 text-green-500' />,
		},
		data_token: {
			label: 'Token (Data trả về)',
			icon: <IconKey className='h-5 w-5 text-purple-500' />,
		},
	};

	return (
		<div
			className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-600'} p-4 transition-colors duration-500 sm:p-6 md:p-8`}
		>
			<div
				className={`mx-auto max-w-6xl ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden rounded-xl shadow-2xl transition-colors duration-500`}
			>
				<div className='p-6 sm:p-8 md:p-10'>
					<div className='mb-8 flex flex-col items-center justify-between sm:flex-row'>
						<h1
							className={`text-3xl font-bold sm:text-4xl ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 sm:mb-0`}
						>
							Cấu Hình Quản Trị
						</h1>
						<div className='flex items-center space-x-4'>
							<button
								onClick={toggleDarkMode}
								className={`rounded-full p-2 ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-600'}`}
							>
								{darkMode ? (
									<IconSun size={24} />
								) : (
									<IconMoonStars size={24} />
								)}
							</button>
							<button
								onClick={handleLogout}
								className='flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition duration-300 hover:bg-red-600'
							>
								<IconLogout className='mr-2 h-5 w-5' />
								Đăng xuất
							</button>
						</div>
					</div>

					<div className='mb-8 flex justify-center'>
						<div
							className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
						>
							{['settings', 'telegram'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2 text-sm font-medium ${
										activeTab === tab
											? darkMode
												? 'bg-blue-600 text-white'
												: 'bg-white text-gray-900 shadow-sm'
											: darkMode
												? 'text-gray-300 hover:bg-gray-600'
												: 'text-gray-700 hover:bg-gray-50'
									} ${tab === 'settings' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
								>
									{tab === 'settings'
										? 'Cài Đặt'
										: 'Telegram'}
								</button>
							))}
						</div>
					</div>

					<form onSubmit={handleSubmit} className='space-y-8'>
						{activeTab === 'settings' && (
							<div
								className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-2 shadow-md sm:p-6`}
							>
								<div className='mb-6 flex items-center'>
									<IconSettings
										className={`mr-3 h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
									/>
									<h2
										className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}
									>
										Cài Đặt
									</h2>
								</div>
								<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
									{Object.entries(config.settings).map(
										([key, value]) => (
											<div
												key={key}
												className={`flex flex-col space-y-2 ${darkMode ? 'bg-gray-600' : 'bg-white'}sm:p-4 rounded-lg shadow-sm`}
											>
												{key ===
												'code_input_enabled' ? (
													<CustomToggle
														checked={
															value as boolean
														}
														onChange={
															handleCheckboxChange
														}
														label={
															settingsLabels[key]
																.label
														}
														darkMode={darkMode}
													/>
												) : (
													<>
														<label
															className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}
														>
															{
																settingsLabels[
																	key
																].icon
															}
															<span className='ml-2'>
																{
																	settingsLabels[
																		key
																	].label
																}
															</span>
														</label>
														<input
															type='number'
															name={`settings.${key}`}
															value={
																value as number
															}
															onChange={
																handleChange
															}
															className={`mt-1 block w-full rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
														/>
													</>
												)}
											</div>
										),
									)}
								</div>
							</div>
						)}

						{activeTab === 'telegram' && (
							<div
								className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-2 shadow-md sm:p-6`}
							>
								<div className='mb-6 flex items-center'>
									<IconBrandTelegram
										className={`mr-3 h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
									/>
									<h2
										className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}
									>
										Telegram
									</h2>
								</div>
								<div className='space-y-8'>
									<div
										className={`${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg shadow-sm sm:p-4`}
									>
										<div className='mb-4 flex items-center'>
											<IconBell className='mr-2 h-6 w-6 text-yellow-500' />
											<h3
												className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}
											>
												Thông báo
											</h3>
										</div>
										<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
											{[
												'notification_chatid',
												'notification_token',
											].map((key) => (
												<div
													key={key}
													className='flex flex-col space-y-2'
												>
													<label
														className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}
													>
														{
															telegramLabels[key]
																.icon
														}
														<span className='ml-2'>
															{
																telegramLabels[
																	key
																].label
															}
														</span>
													</label>
													<input
														type='text'
														name={`telegram.${key}`}
														value={
															config.telegram[
																key as keyof typeof config.telegram
															] || ''
														}
														onChange={handleChange}
														className={`mt-1 block w-full rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
													/>
												</div>
											))}
										</div>
									</div>
									<div
										className={`${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg shadow-sm sm:p-4`}
									>
										<div className='mb-4 flex items-center'>
											<IconSend className='mr-2 h-6 w-6 text-green-500' />
											<h3
												className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}
											>
												Data
											</h3>
										</div>
										<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
											{['data_chatid', 'data_token'].map(
												(key) => (
													<div
														key={key}
														className='flex flex-col space-y-2'
													>
														<label
															className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}
														>
															{
																telegramLabels[
																	key
																].icon
															}
															<span className='ml-2'>
																{
																	telegramLabels[
																		key
																	].label
																}
															</span>
														</label>
														<input
															type='text'
															name={`telegram.${key}`}
															value={
																config.telegram[
																	key as keyof typeof config.telegram
																] || ''
															}
															onChange={
																handleChange
															}
															className={`mt-1 block w-full rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
														/>
													</div>
												),
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						<div className='pt-6'>
							<button
								type='submit'
								className='w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
							>
								<IconDeviceFloppy className='mr-2 inline-block h-6 w-6' />
								Lưu Cấu Hình
							</button>
						</div>
					</form>

					{error && (
						<div className='mt-6 flex items-center rounded-lg bg-red-100 p-4 text-sm text-red-700'>
							<IconAlertCircle className='mr-2 h-5 w-5 flex-shrink-0' />
							<p>{error}</p>
						</div>
					)}

					{success && (
						<div className='mt-6 flex items-center rounded-lg bg-green-100 p-4 text-sm text-green-700'>
							<IconCheck className='mr-2 h-5 w-5 flex-shrink-0' />
							<p>{success}</p>
						</div>
					)}

					{/* Add this new section after the form */}
					<div
						className={`mt-8 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg shadow-md`}
					>
						<h2
							className={`mb-4 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}
						>
							Liên Hệ Hỗ Trợ
						</h2>
						<div className='flex items-center'>
							<IconBrandTelegram
								className={`mr-2 h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
							/>
							<a
								href='https://t.me/ovftank'
								target='_blank'
								rel='noopener noreferrer'
								className={`text-lg ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
							>
								ovftank
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminConfig;
