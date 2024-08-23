import Footer from '@components/Footer';
import Header from '@components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home: React.FC = () => {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex flex-grow flex-col items-center justify-center'>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Home;
