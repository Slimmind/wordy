import { WordDetail, WordType } from './constants';

type UpdatableKeys = 'synonyms' | 'translations' | 'examples';

export default function updateWord(oldWord: WordType): WordType {
	const newWord = { ...oldWord };

	(['synonyms', 'translations', 'examples'] as UpdatableKeys[]).forEach(
		(key) => {
			newWord[key] = newWord[key].map(
				(item: WordDetail | string, index: number) => {
					if (typeof item === 'string') {
						return { id: `${key.slice(0, -1)}-${index + 1}`, value: item };
					}
					return item;
				}
			);
		}
	);

	return newWord;
}
