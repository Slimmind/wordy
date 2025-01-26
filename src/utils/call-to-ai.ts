import { SuggestedAdditions } from './constants';

export const callToAI = async (prompt: string): Promise<SuggestedAdditions> => {
	const API_URL = 'https://api.openai.com/v1/chat/completions';
	const API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;

	if (!API_KEY) {
		throw new Error(
			'API key is missing. Please check your environment variables.'
		);
	}

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: prompt }],
				max_tokens: 3000,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		const data = await response.json();

		// Assume the API response's content matches the SuggestedAdditions type
		return data as SuggestedAdditions;
	} catch (error) {
		console.error('Error calling ChatGPT API:', error);
		throw error;
	}
};
