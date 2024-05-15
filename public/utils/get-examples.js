export default function getExamples(obj) {
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
