import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'create-redirects',
			apply: 'build',
			closeBundle: async () => {
				const filePath = resolve(__dirname, 'dist', '_redirects');
				const content = '/*    /index.html    200';
				try {
					await writeFile(filePath, content);
				} catch (err) {
					console.error(err);
				}
			},
		},
		{
			name: 'create-htaccess',
			apply: 'build',
			closeBundle: async () => {
				const filePath = resolve(__dirname, 'dist', '.htaccess');
				const content = `
RewriteEngine On

RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.php -f
RewriteRule ^(.*)$ $1.php [L]
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
				`;
				try {
					await writeFile(filePath, content.trim());
				} catch (err) {
					console.error(err);
				}
			},
		},
	],
	build: {
		emptyOutDir: true,
	},
	server: {
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:80',
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: [
			{
				find: '@components',
				replacement: resolve(__dirname, 'src/components'),
			},
			{
				find: '@pages',
				replacement: resolve(__dirname, 'src/pages'),
			},
			{ find: '@utils', replacement: resolve(__dirname, 'src/utils') },
			{
				find: '@assets',
				replacement: resolve(__dirname, 'src/assets'),
			},
			{
				find: '@public',
				replacement: resolve(__dirname, 'public'),
			},
			{
				find: '@hooks',
				replacement: resolve(__dirname, 'src/hooks'),
			},
		],
	},
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
});
