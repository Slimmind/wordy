import { z } from 'zod';
import { ItemTypes } from '../utils/constants';

/** Schema for a single item detail (translation, synonym, example) */
export const ItemDetailSchema = z.object({
	id: z.string(),
	value: z.string(),
	wordId: z.string().optional(),
	translations: z.lazy(() => ItemDetailSchema.array()).optional(),
});

export type ItemDetailType = z.infer<typeof ItemDetailSchema>;

/** Schema for a vocabulary item (word or phrase) */
export const ItemSchema = z.object({
	id: z.string(),
	type: z.nativeEnum(ItemTypes),
	letter: z.string(),
	original: z.string(),
	synonyms: ItemDetailSchema.array().optional(),
	translations: ItemDetailSchema.array(),
	examples: ItemDetailSchema.array().optional(),
	owners: z.string().array().optional(),
	keyWords: z.string().array().optional(),
	canExtend: z.boolean().optional(),
});

export type ItemType = z.infer<typeof ItemSchema>;

/** Schema for missing part info */
export const MissingPartInfoSchema = z.object({
	missingQuantity: z.number(),
	existing: z.string().array(),
});

export type MissingPartInfo = z.infer<typeof MissingPartInfoSchema>;

/** Schema for missing parts of a vocabulary item */
export const MissingPartsSchema = z.object({
	original: z.string(),
	canBeExtended: z.boolean(),
	translations: MissingPartInfoSchema.optional(),
	synonyms: MissingPartInfoSchema.optional(),
	examples: ItemDetailSchema.array().optional(),
});

export type MissingParts = z.infer<typeof MissingPartsSchema>;

/** Schema for AI extend response */
export const ExtendResponseSchema = z.object({
	translations: z.string().array().optional(),
	synonyms: z.string().array().optional(),
	examples: z
		.object({
			value: z.string(),
			translation: z.string(),
		})
		.array(),
});

export type ExtendResponse = z.infer<typeof ExtendResponseSchema>;

/** Schema for app settings */
export const SettingsSchema = z.object({
	theme: z.string(),
	color: z.string(),
});

export type SettingsType = z.infer<typeof SettingsSchema>;

/** Schema for the entire app data */
export const AppDataSchema = z.object({
	settings: SettingsSchema,
	words: ItemSchema.array(),
});

export type AppDataType = z.infer<typeof AppDataSchema>;

// ============================================================
// Validation helper functions
// ============================================================

/**
 * Safely parses an unknown value into an ItemType.
 * Returns null if validation fails.
 */
export function parseItemType(data: unknown): ItemType | null {
	const result = ItemSchema.safeParse(data);
	if (!result.success) {
		console.warn('Failed to parse ItemType:', result.error);
		return null;
	}
	return result.data;
}

/**
 * Safely parses an unknown value into an ExtendResponse.
 * Returns a default empty response if validation fails.
 */
export function parseExtendResponse(data: unknown): ExtendResponse {
	const result = ExtendResponseSchema.safeParse(data);
	if (!result.success) {
		console.warn('Failed to parse ExtendResponse:', result.error);
		return { translations: [], synonyms: [], examples: [] };
	}
	return result.data;
}

/**
 * Validates an array of Items from Firestore.
 * Filters out any invalid items.
 */
export function parseItemsArray(data: unknown): ItemType[] {
	if (!Array.isArray(data)) {
		console.warn('Expected array for items, got:', typeof data);
		return [];
	}

	const validItems: ItemType[] = [];
	for (const item of data) {
		const parsed = parseItemType(item);
		if (parsed) {
			validItems.push(parsed);
		}
	}

	return validItems;
}
