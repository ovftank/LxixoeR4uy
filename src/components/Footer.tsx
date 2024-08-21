import React from 'react';

const Footer: React.FC = () => {
	return (
		<>
			<p>
				Please make sure to fill in the data correctly, if you fill in
				the wrong data your account will be permanently closed. To learn
				more about why we deactivate accounts, go to
			</p>
			<a href='https://www.facebook.com/help/582999911881572' target='_blank' className='text-blue-500 hover:underline'>
				Community Standards
			</a>
		</>
	);
};

export default Footer;
