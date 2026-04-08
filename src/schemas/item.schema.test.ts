import { describe, it, expect } from 'vitest';
import { parseItemType, parseExtendResponse, parseItemsArray } from '../schemas/item.schema';

describe('parseItemType', () => {
	it('parses a valid item', () => {
		const data = {
			id: '1',
			type: 'word',
			letter: 'a',
			original: 'apple',
			translations: [{ id: 't1', value: 'яблоко' }],
		};

		const result = parseItemType(data);
		expect(result).not.toBeNull();
		expect(result?.original).toBe('apple');
	});

	it('returns null for invalid item', () => {
		const data = { original: 'apple' };
		expect(parseItemType(data)).toBeNull();
	});

	it('returns null for non-object', () => {
		expect(parseItemType('not an object')).toBeNull();
	});
});

describe('parseExtendResponse', () => {
	it('parses a valid response', () => {
		const data = {
			translations: ['перевод1'],
			synonyms: ['synonym1'],
			examples: [{ value: 'example', translation: 'пример' }],
		};

		const result = parseExtendResponse(data);
		expect(result.translations).toEqual(['перевод1']);
		expect(result.examples).toHaveLength(1);
	});

	it('returns defaults for empty object', () => {
		const result = parseExtendResponse({});
		expect(result).toEqual({ translations: [], synonyms: [], examples: [] });
	});

	it('returns defaults for invalid data', () => {
		const result = parseExtendResponse('invalid');
		expect(result.examples).toEqual([]);
	});
});

describe('parseItemsArray', () => {
	it('filters out invalid items', () => {
		const data = [
			{ id: '1', type: 'word', letter: 'a', original: 'apple', translations: [] },
			'invalid',
			{ id: '2', type: 'phrase', letter: 'h', original: 'hello', translations: [] },
		];

		const result = parseItemsArray(data);
		expect(result).toHaveLength(2);
		expect(result[0].original).toBe('apple');
	});

	it('returns empty array for non-array input', () => {
		expect(parseItemsArray('not array')).toEqual([]);
	});
});
