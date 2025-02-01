import {
	ExtendResponse,
	ItemType,
	MissingParts,
	desiredAmountOfExamples,
	desiredAmountOfItemDetails,
} from './constants';
import { createPrompt } from './create-prompt';
import { extendByOpenAI } from './extendByOpenAI';

/**
 * Отправляет промпт на API и получает ответ
 */
const sendPromptToAPI = async (prompt: string): Promise<ExtendResponse> => {
	try {
		return await extendByOpenAI(prompt);
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
	const neededExamplesCount = Math.max(
		0,
		desiredAmountOfExamples - existingExamples.length
	);
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
