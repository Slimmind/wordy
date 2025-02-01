import { ExtendResponse, presettingAI } from './constants';

export const extendByLocalAI = async (
	prompt: string
): Promise<ExtendResponse> => {
	try {
		const response = await fetch('https://192.168.0.185:3000/ask', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				model: 'wordy',
				prompt: `${presettingAI} ${prompt}`,
				email: 'slimmind@gmail.com',
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching from local AI:', error);
		return {
			translations: [],
			synonyms: [],
			examples: [],
		};
	}
};
