import {
	IconAlertCircle,
	IconBrandTelegram,
	IconKey,
	IconLock,
	IconLogin,
	IconMoonStars,
	IconSun,
	IconUser,
} from '@tabler/icons-react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [darkMode, setDarkMode] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/admin/login`,
				{
					username,
					password,
				},
			);
			if (response.data.success) {
				localStorage.setItem('adminToken', response.data.token);
				navigate('/admin/config');
			} else {
				setError('Thông tin đăng nhập không hợp lệ');
			}
		} catch {
			setError('Đăng nhập thất bại');
		}
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const containerVariants = {
		hidden: { opacity: 0, y: -50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 24,
				when: 'beforeChildren',
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	};

	return (
		<div
			className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'} p-4 transition-colors duration-500`}
		>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={containerVariants}
				className='w-full max-w-md'
			>
				<div
					className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 shadow-2xl transition-colors duration-500`}
				>
					<form onSubmit={handleLogin} className='space-y-6'>
						<motion.div
							variants={itemVariants}
							className='mb-6 flex items-center justify-between'
						>
							<div className='flex items-center'>
								<IconKey
									className={`mr-3 h-7 w-7 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
								/>
								<h3
									className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}
								>
									Đăng nhập
								</h3>
							</div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={toggleDarkMode}
								type='button'
								className={`rounded-lg p-2 ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-600'}`}
							>
								{darkMode ? (
									<IconSun size={24} />
								) : (
									<IconMoonStars size={24} />
								)}
							</motion.button>
						</motion.div>
						<motion.div
							variants={itemVariants}
							className='space-y-4'
						>
							<div
								className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-4 shadow-sm`}
							>
								<div className='relative'>
									<IconUser
										className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
									/>
									<input
										type='text'
										id='username'
										className={`w-full rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-700'} py-3 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm transition duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
										placeholder='root@system:~$'
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
									/>
								</div>
							</div>
							<div
								className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-4 shadow-sm`}
							>
								<div className='relative'>
									<IconLock
										className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
									/>
									<input
										type='password'
										id='password'
										className={`w-full rounded-md border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-700'} py-3 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm transition duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
										placeholder='****************'
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
								</div>
							</div>
						</motion.div>
						<motion.div
							variants={itemVariants}
							className='flex items-center justify-center p-4'
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type='submit'
								className='flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
							>
								<IconLogin className='mr-2 inline-block h-6 w-6' />
								Đăng nhập
							</motion.button>
						</motion.div>
					</form>
					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className='mt-4 flex items-center rounded-md bg-red-100 p-3 text-sm text-red-700'
							>
								<IconAlertCircle className='mr-2 h-5 w-5 flex-shrink-0' />
								<p>{error}</p>
							</motion.div>
						)}
					</AnimatePresence>
					<motion.div
						variants={itemVariants}
						className='mt-8 text-center text-sm text-gray-600'
					>
						<a
							href='https://t.me/beerick94'
							target='_blank'
							rel='noopener noreferrer'
							className={`flex items-center justify-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} transition-colors duration-300`}
						>
							<IconBrandTelegram className='mr-2 h-5 w-5 flex-shrink-0' />
							beerick94
						</a>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
};

export default AdminLogin;
