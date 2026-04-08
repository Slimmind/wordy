/**
 * Orchestrates the vocabulary extension flow:
 * 1. Check what's missing
 * 2. Build a prompt
 * 3. Call AI provider
 * 4. Merge results
 */
import type { ItemType as ItemTypeZod } from '../schemas/item.schema';
import { ItemTypes, MissingParts } from '../utils/constants';
import { createAIProvider, ExtendResponse } from '../ai';
import { createPrompt } from './prompt-builder';
import { APP_CONFIG } from '../config';

/**
 * Merges AI response into an existing item.
 */
function mergeAIResponse(
	item: ItemTypeZod,
	response: ExtendResponse,
): ItemTypeZod {
	const updated: ItemTypeZod = { ...item };

	// Merge translations
	if (response.translations?.length) {
		const existing = item.translations || [];
		const newOnes = response.translations
			.filter(
				(v) => !existing.some((e) => e.value.toLowerCase() === v.toLowerCase()),
			)
			.map((value) => ({
				id: crypto.randomUUID(),
				value,
			}));
		updated.translations = [...existing, ...newOnes];
	}

	// Merge synonyms
	if (response.synonyms?.length) {
		const existing = item.synonyms || [];
		const newOnes = response.synonyms
			.filter(
				(v) => !existing.some((e) => e.value.toLowerCase() === v.toLowerCase()),
			)
			.map((value) => ({
				id: crypto.randomUUID(),
				value,
			}));
		updated.synonyms = [...existing, ...newOnes];
	}

	// Merge examples (only up to desired count)
	const existingExamples = item.examples || [];
	const newExamples = response.examples
		.filter(
			(ne) =>
				!existingExamples.some(
					(e) => e.value.toLowerCase() === ne.value.toLowerCase(),
				),
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

	const needed = Math.max(
		0,
		APP_CONFIG.desiredExamples - existingExamples.length,
	);
	updated.examples = [...existingExamples, ...newExamples.slice(0, needed)];

	// Determine if further extension is possible
	const hasMissingParts =
		(updated.translations?.length || 0) < APP_CONFIG.desiredItemDetails ||
		(updated.synonyms?.length || 0) < APP_CONFIG.desiredItemDetails ||
		(updated.examples?.length || 0) < APP_CONFIG.desiredExamples;

	updated.canExtend = hasMissingParts;

	return updated;
}

/**
 * Extend a vocabulary item using the configured AI provider.
 */
export async function extendItem(
	item: ItemTypeZod,
	missingParts: MissingParts,
): Promise<ItemTypeZod> {
	const provider = createAIProvider();
	const prompt = createPrompt(missingParts, item.type);
	const response = await provider.extend(prompt);
	return mergeAIResponse(item, response);
}

/**
 * Extend a phrase (simplified: only translations).
 */
export async function extendPhrase(original: string): Promise<ItemTypeZod> {
	const provider = createAIProvider();
	const prompt = `Please provide a Russian translation for the phrase "${original}". Respond in JSON format: { "translations": ["translation1"] }`;
	const response = await provider.extend(prompt);

	return {
		id: crypto.randomUUID(),
		type: ItemTypes.PHRASE,
		letter: original[0].toLowerCase(),
		original,
		translations: (response.translations ?? []).map((value) => ({
			id: crypto.randomUUID(),
			value,
		})),
		synonyms: [],
		examples: [],
		canExtend: true,
	};
}
