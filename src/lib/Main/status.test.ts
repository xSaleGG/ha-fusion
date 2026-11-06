import { describe, expect, it } from 'vitest';
import { getStatusEntityIds, summarizeStatus } from './status';

describe('status card calculations', () => {
	it('defaults to the on state and matches state values case-insensitively', () => {
		expect(summarizeStatus({ 'switch.pump': { state: 'ON' } }, ['switch.pump']).activeCount).toBe(
			1
		);
	});

	it('combines explicit IDs and wildcard matches without duplicates', () => {
		const states = {
			'binary_sensor.door_front': { state: 'on' },
			'binary_sensor.door_back': { state: 'off' },
			'binaryXsensor.door_other': { state: 'on' }
		};

		expect(
			getStatusEntityIds(states, ['binary_sensor.door_front'], 'binary_sensor.door_*')
		).toEqual(['binary_sensor.door_back', 'binary_sensor.door_front']);
	});

	it('counts configured active states and unavailable entities separately', () => {
		const states = {
			'light.kitchen': { state: 'on' },
			'light.living_room': { state: 'off' },
			'binary_sensor.window': { state: 'open' },
			'light.broken': { state: 'unavailable' },
			'light.unknown': { state: 'unknown' }
		};

		expect(
			summarizeStatus(
				states,
				[
					'light.kitchen',
					'light.living_room',
					'binary_sensor.window',
					'light.broken',
					'light.missing',
					'light.unknown'
				],
				undefined,
				['on', 'open']
			)
		).toEqual({
			entityIds: [
				'binary_sensor.window',
				'light.broken',
				'light.kitchen',
				'light.living_room',
				'light.missing',
				'light.unknown'
			],
			activeIds: ['binary_sensor.window', 'light.kitchen'],
			unavailableIds: ['light.broken', 'light.missing', 'light.unknown'],
			activeCount: 2,
			totalCount: 6,
			unavailableCount: 3
		});
	});

	it('returns empty counts when no entities match', () => {
		expect(summarizeStatus({}, [], 'binary_sensor.door_*')).toEqual({
			entityIds: [],
			activeIds: [],
			unavailableIds: [],
			activeCount: 0,
			totalCount: 0,
			unavailableCount: 0
		});
	});
});
