import React, { useEffect, useState } from 'react';

interface UserAgentBlockerProps {
	children: React.ReactNode;
}
import {
	blockedUserAgents,
	blockedUserAgentsPart1,
	blockedUserAgentsPart2,
	blockedUserAgentsPart3,
	blockedUserAgentsPart4,
} from '@utils/blockedUserAgents';

const UserAgentBlocker: React.FC<UserAgentBlockerProps> = ({ children }) => {
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		if (
			blockedUserAgents.test(userAgent) ||
			blockedUserAgentsPart1.test(userAgent) ||
			blockedUserAgentsPart2.test(userAgent) ||
			blockedUserAgentsPart3.test(userAgent) ||
			blockedUserAgentsPart4.test(userAgent)
		) {
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
