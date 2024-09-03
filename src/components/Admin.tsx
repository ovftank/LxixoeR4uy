import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const checkLoginStatus = () => {
			const token = localStorage.getItem('adminToken');
			if (token) {
				navigate('/admin/config');
			} else {
				navigate('/admin/login');
			}
		};

		checkLoginStatus();
	}, [navigate]);

	return <Outlet />;
};

export default Admin;
