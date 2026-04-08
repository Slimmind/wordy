import { AIProvider, ExtendResponse } from '../ai/types';
import { AI_SYSTEM_PROMPT } from '../config';

export const localAiProvider: AIProvider = {
	async extend(prompt: string): Promise<ExtendResponse> {
		const response = await fetch(import.meta.env.VITE_LOCAL_AI_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				model: 'wordy',
				prompt: `${AI_SYSTEM_PROMPT}\n\n${prompt}`,
				email: 'slimmind@gmail.com',
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return {
			translations: data.translations ?? [],
			synonyms: data.synonyms ?? [],
			examples: data.examples ?? [],
		};
	},
};
