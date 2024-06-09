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
};

export type SettingsType = {
	theme: string;
	color: string;
};

export type AppDataType = {
	settings: SettingsType;
	words: WordType[];
};
