import { nanoid } from 'nanoid';
import {
	desiredAmountOfItemDetails,
	desiredAmountOfExamples,
	ItemType,
	ItemTypes,
	MissingParts,
	ItemDetailType,
	MissingPartInfo,
} from './constants';

/**
 * Вычисляет количество недостающих элементов
 */
const calculateMissingQuantity = (currentAmount: number): number =>
	Math.max(desiredAmountOfItemDetails - currentAmount, 0);

/**
 * Вычисляет количество недостающих примеров
 */
const calculateMissingExamplesQuantity = (currentAmount: number): number =>
	Math.max(desiredAmountOfExamples - currentAmount, 0);

/**
 * Создает информацию о недостающих частях слова
 */
const createMissingPartInfo = (
	items: ItemDetailType[],
	currentAmount: number
): MissingPartInfo => ({
	missingQuantity: calculateMissingQuantity(currentAmount),
	existing: items
		.map((item) => item.value)
		.filter((value): value is string => value !== undefined),
});

/**
 * Создает массив примеров с переводами
 */
const createExamplesWithTranslations = (
	examples: ItemDetailType[]
): ItemDetailType[] => {
	const examplesQuantity = Math.max(examples.length, desiredAmountOfExamples);

	return Array.from({ length: examplesQuantity }, (_, index) => {
		const existingExample = examples[index];
		return existingExample
			? {
					...existingExample,
					translations: existingExample.translations || [
						{ id: nanoid(), value: '' },
					],
				}
			: {
					id: nanoid(),
					value: '',
					translations: [{ id: nanoid(), value: '' }],
				};
	});
};

/**
 * Проверяет, может ли элемент быть расширен
 */
const canItemBeExtended = (
	missingTranslations: number,
	missingSynonyms?: number,
	missingExamples?: number
): boolean =>
	(missingSynonyms && missingSynonyms > 0) ||
	(missingExamples && missingExamples > 0) ||
	missingTranslations > 0;

/**
 * Проверяет элемент на возможность расширения и возвращает информацию о недостающих частях
 */
export const checkItemForExtending = (item: ItemType): MissingParts => {
	const { original, translations = [], synonyms = [], examples = [] } = item;

	const missingTranslations = calculateMissingQuantity(translations.length);
	const missingSynonyms = calculateMissingQuantity(synonyms.length);
	const missingExamples = calculateMissingExamplesQuantity(examples.length);

	const missingPartsOfWord = {
		translations: createMissingPartInfo(translations, translations.length),
		synonyms: createMissingPartInfo(synonyms, synonyms.length),
		examples: createExamplesWithTranslations(examples),
	};

	const missingPartsOfPhrase = {
		translations: createMissingPartInfo(translations, translations.length),
	};

	const canBeExtended =
		item.type === ItemTypes.WORD
			? canItemBeExtended(missingTranslations, missingSynonyms, missingExamples)
			: canItemBeExtended(missingTranslations);

	return {
		original,
		canBeExtended,
		...(item.type === ItemTypes.WORD
			? missingPartsOfWord
			: missingPartsOfPhrase),
	};
};
