import React from 'react';
import MetaLogo from '@assets/meta-image.png';
const Header: React.FC = () => {
	return (
		<div className='sticky left-0 right-0 top-0 h-12 bg-gray-200 px-4 py-1'>
			<img src={MetaLogo} alt='' className='h-full' />
		</div>
	);
};

export default Header;
