import { GoogleGenAI } from '@google/genai';

import { ExtendResponse, presettingAI } from './constants';

const client = new GoogleGenAI({
	apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const extendByGeminiAI = async (
	prompt: string
): Promise<ExtendResponse> => {
	const response = await client.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: `${presettingAI}, ${prompt}`,
	});

	if (!response) {
		throw new Error('Empty response from API');
	}

	try {
		const jsonMatch = response?.text?.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}
	} catch (error) {
		console.error('Error parsing JSON response:', error);
	}

	return {
		translations: [],
		synonyms: [],
		examples: [],
	};
};
