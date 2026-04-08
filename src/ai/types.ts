/**
 * AI Provider interface — abstraction over different AI backends.
 * Implement this interface to add new AI providers.
 */
export interface AIProvider {
	/** Extend a vocabulary item with translations, synonyms, and examples */
	extend(prompt: string): Promise<ExtendResponse>;
}

export type ExtendResponse = {
	translations?: string[];
	synonyms?: string[];
	examples: Array<{
		value: string;
		translation: string;
	}>;
};
