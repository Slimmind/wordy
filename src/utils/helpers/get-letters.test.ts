import { describe, it, expect } from 'vitest';
import { getLetters } from '.';
import type { ItemType } from '../../utils/constants';

describe('getLetters', () => {
	it('returns sorted unique letters from words', () => {
		const words = [
			{ letter: 'c', original: 'cat' },
			{ letter: 'a', original: 'apple' },
			{ letter: 'c', original: 'car' },
		] as ItemType[];

		expect(getLetters(words)).toEqual(['a', 'c']);
	});

	it('returns empty array for empty input', () => {
		expect(getLetters([])).toEqual([]);
	});
});
