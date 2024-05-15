export default function sanitizeValue(val) {
	if (Array.isArray(val)) {
		return (
			val
				.filter((item) => item !== '')
				.map((item) =>
					typeof item === 'string' ? item.trim().toLowerCase() : item
				) || []
		);
	}

	return typeof val === 'string' ? val.trim().toLowerCase() : val;
}
