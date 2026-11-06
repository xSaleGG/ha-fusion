type EntityStates = Readonly<Record<string, { state?: string }>>;

export interface StatusSummary {
	entityIds: string[];
	activeIds: string[];
	unavailableIds: string[];
	activeCount: number;
	totalCount: number;
	unavailableCount: number;
}

export function getStatusEntityIds(
	states: EntityStates | undefined,
	entities: string[] = [],
	wildcard?: string
): string[] {
	const explicitIds = entities.map((id) => id.trim()).filter(Boolean);
	const pattern = wildcard?.trim();
	const matcher = pattern
		? new RegExp(
				`^${pattern
					.split('*')
					.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
					.join('.*')}$`
			)
		: undefined;
	const wildcardIds = matcher
		? Object.keys(states ?? {}).filter((entityId) => matcher.test(entityId))
		: [];

	return [...new Set([...explicitIds, ...wildcardIds])].sort();
}

export function summarizeStatus(
	states: EntityStates | undefined,
	entities: string[] = [],
	wildcard?: string,
	activeStates: string[] = ['on']
): StatusSummary {
	const entityIds = getStatusEntityIds(states, entities, wildcard);
	const activeStateSet = new Set(
		activeStates.map((state) => state.trim().toLowerCase()).filter(Boolean)
	);
	if (activeStateSet.size === 0) activeStateSet.add('on');

	const unavailableIds = entityIds.filter((entityId) => {
		const state = states?.[entityId]?.state?.toLowerCase();
		return !state || state === 'unknown' || state === 'unavailable';
	});
	const unavailableSet = new Set(unavailableIds);
	const activeIds = entityIds.filter((entityId) => {
		const state = states?.[entityId]?.state?.toLowerCase();
		return !!state && !unavailableSet.has(entityId) && activeStateSet.has(state);
	});

	return {
		entityIds,
		activeIds,
		unavailableIds,
		activeCount: activeIds.length,
		totalCount: entityIds.length,
		unavailableCount: unavailableIds.length
	};
}
