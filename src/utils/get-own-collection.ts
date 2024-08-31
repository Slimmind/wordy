import { ItemType } from './constants';

export default function getOwnCollection(userId: string, words: ItemType[]) {
	return words.filter((word: ItemType) =>
		word.owners?.some((owner: string) => owner === userId)
	);
}
