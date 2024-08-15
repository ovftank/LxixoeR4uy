import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html'],
	theme: {
		extend: {},
	},
	important: true,
	plugins: [],
};

export default config;
