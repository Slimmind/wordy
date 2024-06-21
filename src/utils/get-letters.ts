import { WordType } from './constants';

export default function getLetters(words: WordType[]) {
	return [...new Set(words.map((word: WordType) => word.letter))].sort();
}
