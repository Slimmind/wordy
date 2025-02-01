import { MissingParts, desiredAmountOfItemDetails, desiredAmountOfExamples } from './constants';

/**
 * Создает промпт для расширения элемента на основе данных о недостающих частях
 */
export const createPrompt = (missingParts: MissingParts): string => {
	const { original, translations, synonyms, examples } = missingParts;

	let prompt = `Please help me extend the word "${original}" with the following details:\n\n`;

	// Запрашиваем переводы только если их меньше desiredAmountOfItemDetails
	if (
		translations &&
		translations.existing.length < desiredAmountOfItemDetails
	) {
		prompt += `Translations (need ${desiredAmountOfItemDetails - translations.existing.length} more Russian translations):\n`;
		if (translations.existing.length > 0) {
			prompt += `Existing translations: ${translations.existing.join(', ')}\n`;
		}
		prompt += 'Please provide ONLY Russian translations.\n\n';
	}

	// Запрашиваем синонимы только если их меньше desiredAmountOfItemDetails
	if (synonyms && synonyms.existing.length < desiredAmountOfItemDetails) {
		prompt += `Synonyms (need ${desiredAmountOfItemDetails - synonyms.existing.length} more English synonyms):\n`;
		if (synonyms.existing.length > 0) {
			prompt += `Existing synonyms: ${synonyms.existing.join(', ')}\n`;
		}
		prompt += 'Please provide ONLY English synonyms.\n\n';
	}

	// Проверяем количество непустых примеров
	const nonEmptyExamples = examples.filter(
		(example) => example.value && example?.translations?.[0]?.value
	);
	const emptyExamplesCount = examples.length - nonEmptyExamples.length;

	// Запрашиваем примеры только если есть пустые или их меньше desiredAmountOfExamples
	if (
		emptyExamplesCount > 0 ||
		nonEmptyExamples.length < desiredAmountOfExamples
	) {
		const neededExamples = desiredAmountOfExamples - nonEmptyExamples.length;
		prompt += `Examples (need ${neededExamples} more examples with Russian translations):\n`;
		prompt += 'Please provide examples in English with their Russian translations.\n';
		prompt += 'Each example should be a complete sentence or phrase.\n';
		prompt += 'Make sure examples are diverse and show different contexts of using the word.\n\n';
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

	console.log('PROMPT: ', prompt);

	return prompt;
};
