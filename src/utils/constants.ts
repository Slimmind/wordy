/**
 * @deprecated Use `APP_CONFIG` from `../config` instead.
 * These exports are kept for backwards compatibility.
 */
import { APP_CONFIG, AI_SYSTEM_PROMPT } from '../config';

export enum ItemTypes {
	PHRASE = 'phrase',
	WORD = 'word',
}

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

/** @deprecated Use APP_CONFIG.desiredItemDetails from config.ts */
export const desiredAmountOfItemDetails = APP_CONFIG.desiredItemDetails;
/** @deprecated Use APP_CONFIG.desiredExamples from config.ts */
export const desiredAmountOfExamples = APP_CONFIG.desiredExamples;

export const ValidationMessages = {
	REQUIRED: 'This field is required',
	EMAIL: 'Invalid email address',
	PASSWORD: `Password must be at least ${APP_CONFIG.minPasswordLength} characters`,
	PASSWORD_CONFIRMATION: 'Passwords must match',
	NAME: `Name must be at least ${APP_CONFIG.minNameLength} characters`,
};

/** @deprecated Use AI_SYSTEM_PROMPT from config.ts */
export const presettingAI = AI_SYSTEM_PROMPT;

export type ItemDetailType = {
	id: string;
	value: string;
	wordId?: string;
	translations?: ItemDetailType[];
};

export type ItemType = {
	id: string;
	type: ItemTypes.PHRASE | ItemTypes.WORD;
	letter: string;
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
		missingQuantity?: number;
		existing?: string[];
	};
	synonyms?: {
		missingQuantity: number;
		existing: string[];
	};
	examples?: ItemDetailType[];
};

export type ExtendResponse = {
	translations?: string[];
	synonyms?: string[];
	examples: Array<{
		value: string;
		translation: string;
	}>;
};

export type MissingPartInfo = {
	missingQuantity: number;
	existing: string[];
};
