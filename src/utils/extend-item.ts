import { ItemType, MissingParts, desiredAmountOfExamples, desiredAmountOfItemDetails } from './constants';
import { createPrompt } from './create-prompt';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

type ExtendResponse = {
	translations?: string[];
	synonyms?: string[];
	examples: Array<{
		value: string;
		translation: string;
	}>;
};

/**
 * Отправляет промпт на API и получает ответ
 */
const sendPromptToAPI = async (prompt: string): Promise<ExtendResponse> => {
	try {
		const completion = await client.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that helps to extend English words with translations, synonyms, and examples. Please provide the response in a structured JSON format with the following structure: { "translations": ["translation1", "translation2"], "synonyms": ["synonym1", "synonym2"], "examples": [{"value": "example1", "translation": "translation1"}, {"value": "example2", "translation": "translation2"}] }',
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

		// Пытаемся найти JSON в текстовом ответе
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}

		// Если JSON не найден, парсим текстовый ответ
		const lines = response.split('\n');
		const result: ExtendResponse = {
			translations: [],
			synonyms: [],
			examples: [],
		};

		let currentSection = '';
		for (const line of lines) {
			if (line.startsWith('Translations:')) {
				currentSection = 'translations';
				continue;
			} else if (line.startsWith('Synonyms:')) {
				currentSection = 'synonyms';
				continue;
			} else if (line.startsWith('Examples:')) {
				currentSection = 'examples';
				continue;
			}

			if (line.trim() && currentSection) {
				if (
					currentSection === 'translations' ||
					currentSection === 'synonyms'
				) {
					const value = line.replace(/^\d+\.\s*/, '').trim();
					if (value) {
						(result[currentSection] as string[]).push(value);
					}
				} else if (currentSection === 'examples') {
					if (line.includes('Example:')) {
						const value = line
							.replace(/^.*Example:\s*"/, '')
							.replace(/"$/, '')
							.trim();
						if (value) {
							result.examples.push({
								value,
								translation: '',
							});
						}
					} else if (line.includes('Translation:')) {
						const translation = line
							.replace(/^.*Translation:\s*"/, '')
							.replace(/"$/, '')
							.trim();
						if (translation && result.examples.length > 0) {
							result.examples[result.examples.length - 1].translation =
								translation;
						}
					}
				}
			}
		}

		return result;
	} catch (error) {
		console.error('Error sending prompt to API:', error);
		throw error;
	}
};

/**
 * Обновляет элемент новыми данными
 */
const updateItemWithNewData = (
	item: ItemType,
	newData: ExtendResponse
): ItemType => {
	const updatedItem = { ...item };

	// Обновляем переводы
	if (newData.translations) {
		const existingTranslations = item.translations || [];
		const newTranslations = newData.translations
			.filter(
				(newValue) =>
					!existingTranslations.some(
						(existing) =>
							existing?.value?.toLowerCase() === newValue.toLowerCase()
					)
			)
			.map((value) => ({
				id: crypto.randomUUID(),
				value,
			}));
		updatedItem.translations = [...existingTranslations, ...newTranslations];
	}

	// Обновляем синонимы
	if (newData.synonyms) {
		const existingSynonyms = item.synonyms || [];
		const newSynonyms = newData.synonyms
			.filter(
				(newValue) =>
					!existingSynonyms.some(
						(existing) =>
							existing?.value?.toLowerCase() === newValue.toLowerCase()
					)
			)
			.map((value) => ({
				id: crypto.randomUUID(),
				value,
			}));
		updatedItem.synonyms = [...existingSynonyms, ...newSynonyms];
	}

	// Обновляем примеры
	const existingExamples = item.examples || [];
	const newExamples = newData.examples
		.filter(
			(newExample) =>
				!existingExamples.some(
					(existing) =>
						existing?.value?.toLowerCase() === newExample.value.toLowerCase()
				)
		)
		.map((example) => ({
			id: crypto.randomUUID(),
			value: example.value,
			translations: [
				{
					id: crypto.randomUUID(),
					value: example.translation,
				},
			],
		}));

	// Добавляем только недостающие примеры до достижения желаемого количества
	const neededExamplesCount = Math.max(0, desiredAmountOfExamples - existingExamples.length);
	updatedItem.examples = [
		...existingExamples,
		...newExamples.slice(0, neededExamplesCount),
	];

	// Проверяем, нужно ли показывать кнопку расширения
	const hasMissingParts =
		(updatedItem.translations?.length || 0) < desiredAmountOfItemDetails ||
		(updatedItem.synonyms?.length || 0) < desiredAmountOfItemDetails ||
		(updatedItem.examples?.length || 0) < desiredAmountOfExamples;

	updatedItem.canExtend = hasMissingParts;

	return updatedItem;
};

/**
 * Расширяет элемент с помощью API
 */
export const extendItem = async (
	item: ItemType,
	missingParts: MissingParts
): Promise<ItemType> => {
	try {
		const prompt = createPrompt(missingParts);
		const newData = await sendPromptToAPI(prompt);
		return updateItemWithNewData(item, newData);
	} catch (error) {
		console.error('Error extending item:', error);
		throw error;
	}
};
