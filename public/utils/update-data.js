const fs = require('fs');

function updateData(newData) {
	const newDataString = `export const WORDS = ${JSON.stringify(
		newData,
		null,
		4
	)};\n`;

	fs.writeFile('data.js', newDataString, (err) => {
		if (err) {
			console.error('Error writing file:', err);
		} else {
			console.log('Data updated successfully.');
		}
	});
}

module.exports = updateData;
