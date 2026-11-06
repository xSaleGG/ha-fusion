<script lang="ts">
	import Modal from '$lib/Modal/Index.svelte';
	import Entities from '$lib/Main/Entities.svelte';
	import { lang, states } from '$lib/Stores';
	import type { StatusItem } from '$lib/Types';
	import { summarizeStatus } from '$lib/Main/status';

	let { isOpen, sel }: { isOpen: boolean; sel: StatusItem } = $props();

	let heading = $derived(sel?.name || $lang('status_card'));
	let summary = $derived(
		summarizeStatus($states, sel?.entities, sel?.wildcard, sel?.active_states)
	);
	let activeLabel = $derived(sel?.active_label?.trim() || $lang('active'));
	let entityList = $derived({
		name: $lang('entities'),
		entities: summary.entityIds
	});
</script>

{#if isOpen}
	<Modal>
		{#snippet title()}<h1>{heading}</h1>{/snippet}

		<p class="summary">{summary.activeCount} / {summary.totalCount} {activeLabel}</p>
		{#if summary.unavailableCount > 0}
			<p class="unavailable">{summary.unavailableCount} {$lang('unavailable')}</p>
		{/if}

		<Entities sel={entityList} />
	</Modal>
{/if}

<style>
	.summary {
		font-size: 1rem;
		font-weight: 600;
		margin: 0.75rem 0;
	}

	.unavailable {
		color: var(--theme-button-state-color-off);
		margin: 0 0 0.75rem;
	}
</style>
