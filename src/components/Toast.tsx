import { useEffect } from 'react';

type ToastProps = {
	message: string;
	onClose: () => void;
};

const Toast = ({ message, onClose }: ToastProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className='animate-fade-in fixed right-4 top-4 z-50'>
			<div className='rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg'>
				{message}
			</div>
		</div>
	);
};

export default Toast;
