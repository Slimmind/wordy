export type WordDetail = {
	id?: string;
	value?: string;
};

export type WordType = {
	id?: string;
	letter: string;
	original: string;
	synonyms: WordDetail[];
	translations: WordDetail[];
	examples: WordDetail[];
	creator?: string;
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
