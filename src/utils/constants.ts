export type WordDetailType = {
	id: string;
	value?: string;
};

export type PhraseType = {
	id?: string;
	original: string;
	translation: WordDetailType;
	keyWords?: string[];
};

export type WordType = {
	id?: string;
	letter: string;
	original: string;
	synonyms: WordDetailType[];
	translations: WordDetailType[];
	examples: WordDetailType[];
	owners?: string[];
};

export type SettingsType = {
	theme: string;
	color: string;
};

export type AppDataType = {
	settings: SettingsType;
	words: WordType[];
};

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
