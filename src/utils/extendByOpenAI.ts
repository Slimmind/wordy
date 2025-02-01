import OpenAI from 'openai';

import { ExtendResponse, presettingAI } from './constants';

const client = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

export const extendByOpenAI = async (
	prompt: string
): Promise<ExtendResponse> => {
	const completion = await client.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: presettingAI,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	const response = completion.choices[0].message.content;
	if (!response) {
		throw new Error('Empty response from API');
	}

	try {
		const jsonMatch = response.match(/\{[\s\S]*\}/);
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
