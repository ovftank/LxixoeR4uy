import fs from 'fs/promises';
import path from 'path';
import JScrewIt from 'jscrewit';

const convertString2Unicode = (s) => {
	return s
		.split('')
		.map((char) => {
			const hexVal = char.charCodeAt(0).toString(16);
			return '\\u' + ('000' + hexVal).slice(-4);
		})
		.join('');
};

const processFile = async (filePath) => {
	try {
		const data = await fs.readFile(filePath, 'utf8');
		const isHtmlFile = path.extname(filePath).toLowerCase() === '.html';
		const TMPL = `document.write('__UNI__')`;
		const jsString = isHtmlFile
			? TMPL.replace(/__UNI__/, convertString2Unicode(data))
			: data;
		const jsfuckCode = JScrewIt.encode(jsString);

		const finalContent = isHtmlFile
			? `<script type="text/javascript">${jsfuckCode}</script>`
			: jsfuckCode;

		await fs.writeFile(filePath, finalContent);
		console.log(`✅ Encoded: ${filePath}`);
	} catch (error) {
		console.error(`❌ Failed to process ${filePath}:`, error);
		throw error;
	}
};

const walkDir = async (dir) => {
	try {
		const files = await fs.readdir(dir);
		const processPromises = [];

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				console.log(`📁 Entering directory: ${filePath}`);
				processPromises.push(walkDir(filePath));
			} else if (/\.(js|html)$/i.test(file)) {
				processPromises.push(processFile(filePath));
			}
		}

		await Promise.all(processPromises);
	} catch (error) {
		console.error(`❌ Error processing directory ${dir}:`, error);
		throw error;
	}
};

async function main() {
	try {
		console.log('🚀 Starting encoding process...');
		const distPath = path.resolve('dist');
		try {
			await fs.access(distPath);
		} catch {
			console.error('❌ Error: dist directory not found');
			process.exit(1);
		}

		await walkDir(distPath);
		console.log(
			'✨ Successfully encoded all JS and HTML files in dist directory',
		);
	} catch (err) {
		console.error('❌ Fatal error:', err);
		process.exit(1);
	}
}

main();
