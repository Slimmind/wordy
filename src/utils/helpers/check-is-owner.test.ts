import { describe, it, expect } from 'vitest';
import { checkIsOwner } from './check-is-owner';

describe('checkIsOwner', () => {
	it('returns true when userId is in owners array', () => {
		expect(checkIsOwner(['user1', 'user2'], 'user1')).toBe(true);
	});

	it('returns false when userId is not in owners array', () => {
		expect(checkIsOwner(['user1', 'user2'], 'user3')).toBe(false);
	});

	it('returns false for empty owners array', () => {
		expect(checkIsOwner([], 'user1')).toBe(false);
	});
});
