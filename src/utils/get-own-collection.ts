import { WordType } from './constants';

export default function getOwnCollection(userId: string, words: WordType[]) {
	return words.filter((word: WordType) =>
		word.owners?.some((owner: string) => owner === userId)
	);
}
