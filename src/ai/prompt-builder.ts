import { MissingParts, ItemTypes } from '../utils/constants';
import { APP_CONFIG } from '../config';

/**
 * Creates a prompt for extending an item based on missing parts data.
 */
export function createPrompt(
	missingParts: MissingParts,
	itemType: ItemTypes,
): string {
	if (itemType === ItemTypes.PHRASE) {
		let prompt = `Please help me extend the phrase "${missingParts.original}" with the following details:\n\n`;
		if (!missingParts.translations?.existing?.length) {
			prompt += 'Translation (need one Russian translation):\n';
			prompt += 'Please provide ONE Russian translation.\n\n';
		}
		prompt +=
			'Please provide the missing information in a structured format that can be easily parsed.';
		return prompt;
	}

	const { original, translations, synonyms, examples } = missingParts;
	let prompt = `Please help me extend the word "${original}" with the following details:\n\n`;

	if (
		translations &&
		translations.existing &&
		translations.existing.length < APP_CONFIG.desiredItemDetails
	) {
		prompt += `Translations (need ${APP_CONFIG.desiredItemDetails - translations.existing.length} more Russian translations if it's possible):\n`;
		if (translations.existing.length > 0) {
			prompt += `Existing translations: ${translations.existing.join(', ')}\n`;
		}
		prompt += 'Please provide ONLY Russian translations.\n\n';
	}

	if (synonyms && synonyms.existing.length < APP_CONFIG.desiredItemDetails) {
		prompt += `Synonyms (need ${APP_CONFIG.desiredItemDetails - synonyms.existing.length} more English synonyms if it's possible):\n`;
		if (synonyms.existing.length > 0) {
			prompt += `Existing synonyms: ${synonyms.existing.join(', ')}\n`;
		}
		prompt += 'Please provide ONLY English synonyms.\n\n';
	}

	if (examples) {
		const nonEmptyExamples = examples?.filter(
			(example) => example.value && example.translations?.[0]?.value,
		);

		const needed = APP_CONFIG.desiredExamples - nonEmptyExamples.length;
		if (needed > 0) {
			prompt += `Examples (need ${needed} more examples with Russian translations):\n`;
			prompt +=
				'Please provide examples in English with their Russian translations.\n';
			prompt += 'Each example should be a complete sentence or phrase.\n';
			prompt +=
				'Make sure examples are diverse and show different contexts of using the word.\n\n';
			examples.forEach((example, index) => {
				prompt += `${index + 1}. `;
				if (example.value) {
					const cleanValue = example.value.replace(/\n/g, ' ').trim();
					prompt += `Example: "${cleanValue}"\n`;
					if (example.translations && example.translations[0]?.value) {
						prompt += `   Translation: "${example.translations[0].value}"\n`;
					} else {
						prompt += '   Translation: (needed)\n';
					}
				} else {
					prompt += 'Example: (needed)\n   Translation: (needed)\n';
				}
				prompt += '\n';
			});
		}

		prompt +=
			'Please provide the missing information in a structured format that can be easily parsed.';
	}

	return prompt;
}
