export enum ItemTypes {
	PHRASE = 'phrase',
	WORD = 'word',
}

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const desiredAmountOfItemDetails = 3;
export const desiredAmountOfExamples = 10;

export const ValidationMessages = {
	REQUIRED: 'This field is required',
	EMAIL: 'Invalid email address',
	PASSWORD: 'Password must be at least 8 characters',
	PASSWORD_CONFIRMATION: 'Passwords must match',
	NAME: 'Name must be at least 2 characters',
};

export const presettingAI =
	'You are a helpful assistant that helps to extend English words with translations, synonyms, and examples. Please provide the response in a structured JSON format with the following structure: { "translations": ["translation1", "translation2"], "synonyms": ["synonym1", "synonym2"], "examples": [{"value": "example1", "translation": "translation1"}, {"value": "example2", "translation": "translation2"}] }';

export type ItemDetailType = {
	id: string;
	value?: string;
	wordId?: string;
	translations?: ItemDetailType[];
};

export type ItemType = {
	id?: string;
	type: ItemTypes.PHRASE | ItemTypes.WORD;
	letter?: string;
	original: string;
	synonyms?: ItemDetailType[];
	translations: ItemDetailType[];
	examples?: ItemDetailType[];
	owners?: string[];
	keyWords?: string[];
	canExtend?: boolean;
};

export type SettingsType = {
	theme: string;
	color: string;
};

export type AppDataType = {
	settings: SettingsType;
	words: ItemType[];
};

export type MissingParts = {
	original: string;
	canBeExtended: boolean;
	translations?: {
		missingQuantity: number;
		existing: string[];
	};
	synonyms?: {
		missingQuantity: number;
		existing: string[];
	};
	examples: ItemDetailType[];
};

export type ExtendResponse = {
	translations?: string[];
	synonyms?: string[];
	examples: Array<{
		value: string;
		translation: string;
	}>;
};
