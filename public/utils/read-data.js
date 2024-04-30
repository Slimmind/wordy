import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export default function readData() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const filePath = join(__dirname, 'data.json');
	try {
		const jsonData = readFileSync(filePath, 'utf8');
		return JSON.parse(jsonData);
	} catch (error) {
		console.error('Error reading JSON file:', error.message);
		return null;
	}
}
