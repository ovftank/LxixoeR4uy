import { getIp } from '@utils/getIP.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isBot = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	const botPatterns = [
		'googlebot',
		'bingbot',
		'yandexbot',
		'duckduckbot',
		'slurp',
		'baiduspider',
		'facebookexternalhit',
		'twitterbot',
		'rogerbot',
		'linkedinbot',
		'embedly',
		'quora link preview',
		'showyoubot',
		'outbrain',
		'pinterest',
		'slackbot',
		'vkShare',
		'W3C_Validator',
		'render',
	];
	return botPatterns.some((pattern) => userAgent.includes(pattern));
};

const isBlockedIP = async (ip: string): Promise<boolean> => {
	const blockedOrganizations = [
		'facebook',
		'netlify',
		'cloudflare',
		'vercel',
		'github',
		'gitlab',
		'bitbucket',
		'heroku',
		'aws',
		'azure',
		'digitalocean',
		'lighttpd',
		'applebot',
		'googlebot',
		'bingbot',
		'yandexbot',
		'baidu',
		'duckduckbot',
		'pinterest',
		'linkedin',
		'twitter',
		'render',
	];

	try {
		const response = await fetch(
			`https://get.geojs.io/v1/ip/geo/${ip}.json`,
		);
		const data = await response.json();
		if (data.organization) {
			return blockedOrganizations.some((org) =>
				data.organization.toLowerCase().includes(org),
			);
		}
	} catch (error) {
		console.error('Error checking IP:', error);
	}
	return false;
};

const checkAccess = async () => {
	if (isBot()) return false;
	const ip = await getIp();
	if (ip && (await isBlockedIP(ip))) return false;
	return true;
};

checkAccess().then((allowed) => {
	if (allowed) {
		createRoot(document.getElementById('root')!).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	} else {
		// Display a message or an empty page for bots or blocked IPs
		document.body.innerHTML = '<h1>Access Denied</h1>';
	}
});
