<script lang="ts">
	import { editMode, lang, states, itemHeight, ripple } from '$lib/Stores';
	import { openModal } from '$lib/Modals';
	import type { StatusItem } from '$lib/Types';
	import Icon from '@iconify/svelte';
	import Ripple from '$lib/Actions/ripple';
	import { summarizeStatus } from '$lib/Main/status';

	let { sel }: { sel: StatusItem } = $props();

	let title = $derived(sel?.name || $lang('status_card'));
	let summary = $derived(
		summarizeStatus($states, sel?.entities, sel?.wildcard, sel?.active_states)
	);
	let activeLabel = $derived(sel?.active_label?.trim() || $lang('active'));

	function handleClick() {
		if (sel?.type !== 'status') return;

		if ($editMode) {
			openModal(() => import('$lib/Modal/StatusConfig.svelte'), { sel });
		} else {
			openModal(() => import('$lib/Modal/StatusModal.svelte'), { sel });
		}
	}
</script>

<div
	class="container"
	onclick={handleClick}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}}
	aria-label="{title}: {summary.activeCount} / {summary.totalCount} {activeLabel}"
	role="button"
	tabindex="0"
	style:min-height="{$itemHeight}px"
	class:has-icon={Boolean(sel?.icon)}
	use:Ripple={$ripple}
>
	{#if sel?.icon}
		<span class="icon">
			<Icon icon={sel.icon} height="none" />
		</span>
	{/if}

	<span class="content">
		<span class="name">{title}</span>
		<span class="count">{summary.activeCount} / {summary.totalCount} {activeLabel}</span>
		{#if summary.unavailableCount > 0}
			<span class="unavailable">{summary.unavailableCount} {$lang('unavailable')}</span>
		{/if}
	</span>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem;
		border: none;
		border-radius: var(--theme-border-radius, 0.65rem);
		background-color: var(--theme-button-background-color-off);
		color: var(--theme-button-name-color-off);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.container.has-icon {
		grid-template-columns: 2rem minmax(0, 1fr);
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}

	.content {
		display: grid;
		min-width: 0;
	}

	.name {
		overflow: hidden;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.count,
	.unavailable {
		color: var(--theme-button-state-color-off);
		font-size: 0.85rem;
	}
</style>
