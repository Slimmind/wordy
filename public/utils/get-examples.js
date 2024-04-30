export default function getExamples(obj) {
	const keys = Object.keys(obj);

	if (keys.includes('example')) {
		return keys
			.filter((key) => key.startsWith('example'))
			.map((key) => obj[key]);
	}

	return [];
}
