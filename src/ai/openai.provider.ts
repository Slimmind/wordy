import OpenAI from 'openai';

import { AIProvider, ExtendResponse } from '../ai/types';
import { AI_SYSTEM_PROMPT } from '../config';

const client = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

export const openaiProvider: AIProvider = {
	async extend(prompt: string): Promise<ExtendResponse> {
		const completion = await client.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: AI_SYSTEM_PROMPT },
				{ role: 'user', content: prompt },
			],
		});

		const response = completion.choices[0].message.content;
		if (!response) {
			throw new Error('Empty response from OpenAI API');
		}

		try {
			const jsonMatch = response.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]);
				return {
					translations: parsed.translations ?? [],
					synonyms: parsed.synonyms ?? [],
					examples: parsed.examples ?? [],
				};
			}
		} catch (error) {
			console.error('Error parsing JSON response from OpenAI:', error);
		}

		return {
			translations: [],
			synonyms: [],
			examples: [],
		};
	},
};
