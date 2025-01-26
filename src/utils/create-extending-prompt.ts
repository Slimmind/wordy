import { desiredAmountOfItemDetails, MissingParts } from './constants';

export const createExtendingPrompt = (missingParts: MissingParts): string => {
	const { original, translations, synonyms, examples } = missingParts;

	return `Analyze the following data:
  - Original word: ${original}
  - Existing translations: [${translations.existing.join(', ')}]
  - Existing synonyms: [${synonyms.existing.join(', ')}]
  - Examples: ${JSON.stringify(examples)}}

  Your task:
  1. **Translations**:
    - Return an array of translations with a total length of ${desiredAmountOfItemDetails}.
    - Include the existing translations [${translations.existing.join(', ')}] and add your variants of translations for "${original}" in Russian.

  2. **Synonyms**:
    - Return an array of synonyms with a total length of {desiredAmountOfItemDetails}.
    - Include your variants of synonyms for "${original}".

  3. **Examples**:
    - Review the array of examples: ${JSON.stringify(examples)}.
    - For each example with an empty translation value (""), provide a relevant translation based on the example's context.
    - Return the updated array of examples.

  Finally, return an updated object containing:
  - translations: The updated array of translations.
  - synonyms: The updated array of synonyms.
  - examples: The updated array of examples with completed translations.`;
};
