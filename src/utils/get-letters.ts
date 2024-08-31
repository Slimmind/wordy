import { ItemType } from './constants';

export default function getLetters(words: ItemType[]) {
	return [...new Set(words.map((word: ItemType) => word.letter))].sort();
}
