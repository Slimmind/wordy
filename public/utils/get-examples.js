export default function getExamples(obj) {
	console.log('FORM_DATA: ', obj);
	const keys = Object.keys(obj);
	const examples = [];

	if (keys.includes('example')) {
		keys
			.filter((key) => key.startsWith('example'))
			.forEach((key) => {
				if (obj[key]) {
					examples.push(obj[key].trim().toLowerCase());
				}
			});

		return examples;
	}

	return [];
}
