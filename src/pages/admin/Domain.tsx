import Toast from '@components/Toast';
import {
	faGlobe,
	faMagnifyingGlass,
	faPlus,
	faSearch,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const Domain = () => {
	const [domains, setDomains] = useState<string[]>([]);
	const [newDomain, setNewDomain] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const fetchDomains = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/admin/domains', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setDomains(Array.isArray(data) ? data : []);
		} catch {
			setError('Không thể lấy domain');
		}
	};

	useEffect(() => {
		fetchDomains();
	}, []);

	const handleAddDomain = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newDomain.trim()) {
			setToastMessage('Vui lòng nhập domain');
			return;
		}
		if (!newDomain.includes('.')) {
			setToastMessage('Domain không hợp lệ');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/admin/add-domain', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ domain: newDomain }),
			});
			const data = await response.json();
			if (data.success) {
				setSuccess('Thêm domain thành công');
				setNewDomain('');
				fetchDomains();
			} else {
				setError(data.message);
			}
		} catch {
			setToastMessage('Không thể thêm domain');
		}
	};

	const confirmDelete = (domain: string) => {
		setDomainToDelete(domain);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirmed = async () => {
		if (!domainToDelete) return;

		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/admin/delete-domain', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ domain: domainToDelete }),
			});
			const data = await response.json();
			if (data.success) {
				setSuccess(`Đã xóa domain ${domainToDelete}`);
				fetchDomains();
			} else {
				setError(data.message);
			}
		} catch {
			setError('Không thể xóa domain');
		} finally {
			setShowDeleteModal(false);
			setDomainToDelete(null);
		}
	};

	const filteredDomains = domains.filter((domain) =>
		domain.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			{toastMessage && (
				<Toast
					message={toastMessage}
					onClose={() => setToastMessage(null)}
				/>
			)}
			<div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
				<div className='mb-6 flex items-center gap-3'>
					<FontAwesomeIcon
						icon={faGlobe}
						className='text-2xl text-gray-600'
					/>
					<h1 className='text-2xl font-semibold text-gray-800'>
						Quản Lý Domain
					</h1>
				</div>

				<div className='space-y-4'>
					<div>
						<div className='relative mt-1'>
							<input
								id='search'
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='Tìm kiếm domain...'
								className='block w-full rounded-md border border-gray-300 px-4 py-2 pl-10 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
							/>
							<FontAwesomeIcon
								icon={faSearch}
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
						</div>
					</div>

					<form onSubmit={handleAddDomain} className='flex gap-3'>
						<input
							id='newDomain'
							type='text'
							value={newDomain}
							onChange={(e) => setNewDomain(e.target.value)}
							placeholder='Thêm Domain Mới'
							className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm'
							autoFocus
						/>
						<button
							type='submit'
							className='rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-700'
						>
							<FontAwesomeIcon icon={faPlus} className='mr-2' />
							Thêm Domain
						</button>
					</form>

					{(error || success) && (
						<div
							className={`mt-4 rounded-md bg-gray-100 p-3 text-gray-700`}
						>
							{error || success}
						</div>
					)}

					<div className='rounded-md border border-gray-200 bg-gray-50 p-4'>
						<h3 className='mb-4 text-lg font-medium text-gray-700'>
							Danh Sách Domain
						</h3>
						<div className='space-y-2'>
							{filteredDomains.map((domain) => (
								<div
									key={domain}
									className='flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3'
								>
									<span className='text-gray-700'>
										{domain}
									</span>
									<button
										onClick={() => confirmDelete(domain)}
										className='rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900'
										title='Xóa domain'
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							))}

							{domains.length === 0 ? (
								<div className='flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 py-12 text-gray-500'>
									<FontAwesomeIcon
										icon={faGlobe}
										className='mb-4 text-6xl'
									/>
									<p className='mb-2 text-lg font-medium'>
										Chưa có domain nào
									</p>
								</div>
							) : (
								filteredDomains.length === 0 && (
									<div className='flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 py-12 text-gray-500'>
										<FontAwesomeIcon
											icon={faMagnifyingGlass}
											className='mb-4 text-6xl'
										/>
										<p className='mb-2 text-lg font-medium'>
											Không tìm thấy domain {searchTerm}
										</p>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			</div>

			{showDeleteModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
						<h3 className='mb-4 text-lg font-medium text-gray-900'>
							Xác nhận xóa domain
						</h3>
						<p className='mb-6 text-gray-700'>
							Bạn có chắc chắn muốn xóa domain "{domainToDelete}"
							không?
						</p>
						<div className='flex justify-end gap-3'>
							<button
								onClick={() => setShowDeleteModal(false)}
								className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300'
							>
								Hủy
							</button>
							<button
								onClick={handleDeleteConfirmed}
								className='rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800'
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Domain;
