import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
	username: string;
	password: string;
}

interface LoginResponse {
	success: boolean;
	token?: string;
	message?: string;
}

const Login = () => {
	const navigate = useNavigate();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		username: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const response = await axios.post<LoginResponse>(
				'/api/admin/login',
				credentials,
			);

			if (response.data.success && response.data.token) {
				localStorage.setItem('token', response.data.token);
				navigate('/admin/dashboard');
			} else {
				throw new Error(response.data.message ?? 'Đăng nhập thất bại');
			}
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError('Đăng nhập thất bại. Vui lòng thử lại.');
			}
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (!localStorage.getItem('token')) return;
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
				if (res.data.success && res.data.is_admin)
					navigate('/admin/vip');
				else navigate('/admin/dashboard');
			})
			.catch(() => {
				localStorage.removeItem('token');
			});
	}, [navigate]);

	return (
		<div className='hidden min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:flex sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					{error && (
						<div className='rounded-md bg-gray-100 p-4'>
							<div className='text-sm text-gray-700'>{error}</div>
						</div>
					)}
					<div className='-space-y-px rounded-md shadow-sm'>
						<div>
							<input
								id='username'
								name='username'
								type='text'
								autoComplete='username'
								required
								className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-gray-400 sm:text-sm'
								placeholder='Username'
								value={credentials.username}
								onChange={(e) =>
									setCredentials({
										...credentials,
										username: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								required
								className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-gray-400 sm:text-sm'
								placeholder='Password'
								value={credentials.password}
								onChange={(e) =>
									setCredentials({
										...credentials,
										password: e.target.value,
									})
								}
							/>
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-400'
						>
							{isLoading ? 'Loading...' : 'Đăng nhập'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
