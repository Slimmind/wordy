import { nanoid } from 'nanoid';
import {
	desiredAmountOfItemDetails,
	ItemType,
	MissingParts,
} from './constants';

export const checkItemForExtending = (item: ItemType): MissingParts => {
	const { original, translations = [], synonyms = [], examples = [] } = item;

	const countMissingQuantity = (amount: number): number =>
		Math.max(desiredAmountOfItemDetails - amount, 0);

	const countMissedExamplesTranslations = () => {
		const examplesQuantity = Math.max(
			examples.length,
			desiredAmountOfItemDetails
		);

		const updatedExamples = Array.from({ length: examplesQuantity }, (_, i) =>
			examples[i]
				? {
						...examples[i],
						translations: examples[i].translations || [
							{ id: nanoid(), value: '' },
						],
					}
				: {
						id: nanoid(),
						value: '',
						translations: [{ id: nanoid(), value: '' }],
					}
		);

		return updatedExamples;
	};

	const missingTranslations = countMissingQuantity(translations.length);
	const missingSynonyms = countMissingQuantity(synonyms.length);
	const missingExamples = countMissingQuantity(examples.length);
	const canBeExtended =
		missingTranslations < desiredAmountOfItemDetails ||
		missingSynonyms < desiredAmountOfItemDetails ||
		missingExamples < desiredAmountOfItemDetails;

	return {
		original,
		canBeExtended,
		translations: {
			missingQuantity: missingTranslations,
			existing: translations
				.map((translation) => translation.value)
				.filter((value): value is string => value !== undefined),
		},
		synonyms: {
			missingQuantity: missingSynonyms,
			existing: synonyms
				.map((synonym) => synonym.value)
				.filter((value): value is string => value !== undefined),
		},
		examples: countMissedExamplesTranslations(),
	};
};
