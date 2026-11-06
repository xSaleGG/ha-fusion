import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { entityList, states } from './Stores';

describe('entity state without a Home Assistant connection', () => {
	it('starts with an empty entity map for configuration selects', () => {
		expect(get(states)).toEqual({});
		expect(get(entityList)('')).toEqual([]);
	});
});
