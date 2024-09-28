import fs from 'fs/promises';
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

async function main() {
	try {
		const data = await fs.readFile('dist/index.html', 'utf8');
		const TMPL = `document.write('__UNI__')`;
		const jsString = TMPL.replace(/__UNI__/, convertString2Unicode(data));
		const jsfuckCode = JScrewIt.encode(jsString);
		const TMPLHTML = `<script type="text/javascript">${jsfuckCode}</script>`;
		await fs.writeFile('dist/index.html', TMPLHTML);
	} catch (err) {
		console.error('Error:', err);
	}
}

main();
