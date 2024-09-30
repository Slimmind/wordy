export enum ItemTypes {
	PHRASE = 'phrase',
	WORD = 'word',
}

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

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
};

export type SettingsType = {
	theme: string;
	color: string;
};

export type AppDataType = {
	settings: SettingsType;
	words: ItemType[];
};
