import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export default function writeData(data) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const filePath = join(__dirname, 'data.json');

	try {
		const jsonData = JSON.stringify(data, null, 2);
		writeFileSync(filePath, jsonData);
		console.log('Data has been written to', filePath);
	} catch (error) {
		console.error('Error writing to JSON file:', error.message);
	}
}
