import Footer from '@components/Footer';
import Header from '@components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Home;