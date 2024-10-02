export enum ItemTypes {
  PHRASE = "phrase",
  WORD = "word",
}

export const THEME_DARK = "dark";
export const THEME_LIGHT = "light";

export const ValidationMessages = {
  REQUIRED: "This field is required",
  EMAIL: "Invalid email address",
  PASSWORD: "Password must be at least 8 characters",
  PASSWORD_CONFIRMATION: "Passwords must match",
  NAME: "Name must be at least 2 characters",
};

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
