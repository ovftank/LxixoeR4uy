import React, { useEffect, useState } from 'react';

interface UserAgentBlockerProps {
	children: React.ReactNode;
}

const blockedUserAgents =
	/googlebot|puppeteer|selenium|zgrab|masscan|crawler|bot|spider|curl|wget|python|java|ruby|krebsonsecurity|ivre-masscan|go-http-client|python-requests|censysinspect|facebookexternalhit/i;

const UserAgentBlocker: React.FC<UserAgentBlockerProps> = ({ children }) => {
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		if (blockedUserAgents.test(userAgent)) {
			setIsBlocked(true);
		}
	}, []);

	if (isBlocked) {
		return (
			<h1 className='flex min-h-svh items-center justify-center text-center text-9xl text-red-500'>
				????
			</h1>
		);
	}

	return <>{children}</>;
};

export default UserAgentBlocker;
