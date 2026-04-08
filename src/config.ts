/**
 * Application configuration.
 * Centralizes all magic numbers and default values.
 */
export const APP_CONFIG = {
	/** Desired number of translations/synonyms per vocabulary item */
	desiredItemDetails: 3,
	/** Desired number of example sentences per vocabulary item */
	desiredExamples: 10,
	/** Minimum password length */
	minPasswordLength: 8,
	/** Minimum name length */
	minNameLength: 2,
	/** Skeleton loading fallback delay in milliseconds */
	skeletonDelayMs: 3000,
	/** Debounce delay for search input in milliseconds */
	searchDebounceMs: 300,
} as const;

/** AI system prompt used for extending vocabulary items */
export const AI_SYSTEM_PROMPT =
	'You are a helpful assistant that helps to extend English words with translations, synonyms, and examples. Please provide the response in a structured JSON format with the following structure: { "translations": ["translation1", "translation2"], "synonyms": ["synonym1", "synonym2"], "examples": [{"value": "example1", "translation": "translation1"}, {"value": "example2", "translation": "translation2"}] }';

/** Available AI providers */
export type AIProviderType = 'openai' | 'local';

/** Currently selected AI provider — change this to switch providers */
export const CURRENT_AI_PROVIDER: AIProviderType = 'openai';
