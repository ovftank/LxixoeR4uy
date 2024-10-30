import {
	faCog,
	faGlobe,
	faPaperPlane,
	faServer,
	faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard: FC = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const location = useLocation();
	const telegramMessage = encodeURIComponent(
		`Server ${window.location.hostname} có vấn đề`,
	);

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/admin');
	};

	const navItems = [
		{
			path: '',
			icon: faServer,
			label: `VPS ${name}`,
		},
		{
			path: 'domain',
			icon: faGlobe,
			label: 'Cài Đặt Domain',
		},
		{
			path: 'telegram',
			icon: faPaperPlane,
			label: 'Cấu Hình Telegram',
		},
		{
			path: 'website',
			icon: faCog,
			label: 'Cài Đặt Website',
		},
	];

	useEffect(() => {
		axios
			.post(
				'/api/admin/check-token',
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
			)
			.then((res) => {
				if (res.data.is_admin) navigate('/admin/vip');
			})
			.catch(() => {
				localStorage.removeItem('token');
				navigate('/admin');
			});
		axios
			.post(
				'/api/admin/get-info',
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
			)
			.then((res) => {
				if (res.data.name === 'admin') navigate('/admin/vip');
				else setName(res.data.name);
			});
	}, [navigate]);

	return (
		<div className='flex h-screen bg-gray-100'>
			<div className='w-64 bg-white shadow-lg'>
				<nav className='mt-4'>
					{navItems.map((item) => {
						const isActive =
							location.pathname ===
							`/admin/dashboard/${item.path}`;
						return item.path === '' ? (
							<div
								key={item.path}
								className={`flex items-center px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 ${isActive ? 'border-r-4 border-gray-700 bg-gray-100 font-medium' : ''}`}
							>
								<FontAwesomeIcon
									icon={item.icon}
									className={`h-5 w-5 ${isActive ? 'text-gray-900' : ''}`}
								/>
								<span
									className={`ml-3 ${isActive ? 'text-gray-900' : ''}`}
								>
									{item.label}
								</span>
							</div>
						) : (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center px-6 py-3 transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
							>
								<FontAwesomeIcon
									icon={item.icon}
									className={`h-5 w-5 ${isActive ? 'text-white' : ''}`}
								/>
								<span
									className={`ml-3 ${isActive ? 'text-white' : ''}`}
								>
									{item.label}
								</span>
							</Link>
						);
					})}

					<button
						onClick={handleLogout}
						className='flex w-full items-center px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100'
					>
						<FontAwesomeIcon
							icon={faSignOutAlt}
							className='h-5 w-5'
						/>
						<span className='ml-3'>Đăng Xuất</span>
					</button>
				</nav>
			</div>
			<div className='relative flex-1 overflow-auto'>
				<div className='p-8'>
					<Outlet />
				</div>

				<a
					href={`https://t.me/beerick94?text=${telegramMessage}`}
					target='_blank'
					rel='noopener noreferrer'
					className='fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-gray-700 px-4 py-3 text-white shadow-lg transition-colors duration-200 hover:bg-gray-800'
					title='Liên hệ hỗ trợ qua Telegram'
				>
					<FontAwesomeIcon icon={faPaperPlane} className='h-5 w-5' />
					<span className='font-medium'>Trợ Giúp</span>
				</a>
			</div>
		</div>
	);
};

export default Dashboard;
