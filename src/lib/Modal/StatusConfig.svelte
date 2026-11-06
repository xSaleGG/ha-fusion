<script lang="ts">
	import { entityList, lang, ripple } from '$lib/Stores';
	import type { StatusItem } from '$lib/Types';
	import ConfigModal from '$lib/Modal/ConfigModal.svelte';
	import InputClear from '$lib/Components/InputClear.svelte';
	import Select from '$lib/Components/Select.svelte';
	import StatusCard from '$lib/Main/StatusCard.svelte';
	import Icon from '@iconify/svelte';
	import Ripple from '$lib/Actions/ripple';

	let { isOpen, sel }: { isOpen: boolean; sel: StatusItem } = $props();

	// svelte-ignore state_referenced_locally
	let form = $state({
		sourceMode: sel?.wildcard ? 'wildcard' : 'list',
		name: sel?.name,
		icon: sel?.icon,
		activeLabel: sel?.active_label,
		wildcard: sel?.wildcard,
		activeStateText: (sel?.active_states?.length ? sel.active_states : ['on']).join(', ')
	});

	let options = $derived($entityList(''));
	let canAddEntity = $derived((sel?.entities ?? []).every(Boolean));

	type SetValue = string | string[] | undefined;
	type SetConfig = (key: string, value?: SetValue) => void;

	function filterOptions(active: string) {
		return options.filter(
			(option) => !sel?.entities?.some((id) => id === option.id) || option.id === active
		);
	}

	function setSource(mode: 'list' | 'wildcard', set: SetConfig) {
		form.sourceMode = mode;
		if (mode === 'list') {
			set('wildcard');
		} else {
			set('entities');
		}
	}

	function setActiveStates(value: string, set: SetConfig) {
		form.activeStateText = value;
		const activeStates = [
			...new Set(
				value
					.split(',')
					.map((state) => state.trim())
					.filter(Boolean)
			)
		];
		set('active_states', activeStates.length ? activeStates : ['on']);
	}
</script>

<ConfigModal {isOpen} bind:sel title={$lang('status_card')}>
	{#snippet children(set)}
		<h2>{$lang('preview')}</h2>
		<div class="preview" style:pointer-events="none">
			<StatusCard {sel} />
		</div>

		<h2>{$lang('name')}</h2>
		<InputClear
			condition={form.name}
			onclear={() => {
				form.name = undefined;
				set('name');
			}}
		>
			{#snippet children(padding)}
				<input
					name={$lang('name')}
					class="input"
					type="text"
					placeholder={$lang('name')}
					autocomplete="off"
					spellcheck="false"
					bind:value={form.name}
					oninput={() => set('name', form.name)}
					style:padding
				/>
			{/snippet}
		</InputClear>

		<h2>{$lang('icon')}</h2>
		<div class="icon-field">
			<InputClear
				condition={form.icon}
				onclear={() => {
					form.icon = undefined;
					set('icon');
				}}
			>
				{#snippet children(padding)}
					<input
						name={$lang('icon')}
						class="input"
						type="text"
						placeholder={$lang('icon')}
						autocomplete="off"
						spellcheck="false"
						bind:value={form.icon}
						oninput={() => set('icon', form.icon)}
						style:padding
					/>
				{/snippet}
			</InputClear>

			<button
				use:Ripple={$ripple}
				title={$lang('icon')}
				class="icon-gallery"
				onclick={() => {
					window.open('https://icon-sets.iconify.design/', '_blank', 'noopener,noreferrer');
				}}
			>
				<Icon icon="majesticons:open-line" height="none" />
			</button>
		</div>

		<h2>{$lang('active_label')}</h2>
		<InputClear
			condition={form.activeLabel}
			onclear={() => {
				form.activeLabel = undefined;
				set('active_label');
			}}
		>
			{#snippet children(padding)}
				<input
					name={$lang('active_label')}
					class="input"
					type="text"
					placeholder={$lang('active')}
					autocomplete="off"
					spellcheck="false"
					bind:value={form.activeLabel}
					oninput={() => set('active_label', form.activeLabel?.trim() || undefined)}
					style:padding
				/>
			{/snippet}
		</InputClear>

		<h2>{$lang('entity_source')}</h2>
		<div class="button-container">
			<button class:selected={form.sourceMode === 'list'} onclick={() => setSource('list', set)}>
				{$lang('entity_list')}
			</button>
			<button
				class:selected={form.sourceMode === 'wildcard'}
				onclick={() => setSource('wildcard', set)}
			>
				{$lang('wildcard')}
			</button>
		</div>

		{#if form.sourceMode === 'list'}
			<h2>{$lang('entities')}</h2>
			{#each sel?.entities ?? [] as entityId, index (index)}
				<Select
					computeIcons={true}
					placeholder={$lang('entity')}
					options={filterOptions(entityId)}
					value={entityId || ''}
					clearable={true}
					onchange={(event) => {
						const next = event
							? (sel.entities ?? []).map((id, i) => (i === index ? event : id))
							: (sel.entities ?? []).filter((_, i) => i !== index);
						set('entities', next);
					}}
				/>
				<br />
			{/each}

			<button
				class="options action"
				onclick={() => set('entities', [...(sel?.entities ?? []), ''])}
				disabled={!canAddEntity}
				style:opacity={!canAddEntity ? '0.4' : '1'}
				style:cursor={!canAddEntity ? 'unset' : 'pointer'}
			>
				{$lang('add')}
			</button>
		{:else}
			<h2>{$lang('wildcard')}</h2>
			<InputClear
				condition={form.wildcard}
				onclear={() => {
					form.wildcard = undefined;
					set('wildcard');
				}}
			>
				{#snippet children(padding)}
					<input
						name={$lang('wildcard')}
						class="input"
						type="text"
						placeholder="binary_sensor.door_*"
						autocomplete="off"
						spellcheck="false"
						bind:value={form.wildcard}
						oninput={() => set('wildcard', form.wildcard)}
						style:padding
					/>
				{/snippet}
			</InputClear>
		{/if}

		<h2>{$lang('active_states')}</h2>
		<input
			name={$lang('active_states')}
			class="input"
			type="text"
			placeholder="on, open, wet"
			autocomplete="off"
			spellcheck="false"
			bind:value={form.activeStateText}
			oninput={() => setActiveStates(form.activeStateText, set)}
		/>
	{/snippet}
</ConfigModal>

<style>
	.preview {
		width: min(100%, 20rem);
	}

	.icon-field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.8rem;
	}
</style>
