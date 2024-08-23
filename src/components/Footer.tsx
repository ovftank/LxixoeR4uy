import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className='flex items-center justify-center p-4 text-gray-700'>
			<p>
				<FontAwesomeIcon
					icon={faTriangleExclamation}
					className='text-yellow-600'
				/>{' '}
				Please make sure to fill in the data correctly; otherwise, your
				account may be permanently closed. To learn more about why
				accounts are deactivated, visit our{' '}
				<a
					href='https://www.facebook.com/help/582999911881572'
					target='_blank'
					rel='noopener noreferrer'
					className='text-blue-600 hover:underline'
				>
					Community Standards
				</a>{' '}
				.
			</p>
		</footer>
	);
};

export default Footer;
