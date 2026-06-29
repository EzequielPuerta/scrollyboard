<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import ChartConfigForm from './chart/ChartConfigForm.svelte';
	import { emptyChartConfig, type ChartConfig } from '$lib/chart-config';
	import type { ChartComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: ChartComponent;
		onClose: () => void;
		onSave: (data: ChartComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	function toConfig(d?: ChartComponent): ChartConfig {
		if (!d) return emptyChartConfig();
		// Drop the discriminant and clone so edits stay local until saved.
		const { type: _t, ...rest } = d;
		return { ...emptyChartConfig(), ...structuredClone($state.snapshot(rest)) };
	}

	let config = $state<ChartConfig>(toConfig(data));

	function save() {
		onSave({ type: 'chart', ...($state.snapshot(config) as ChartConfig) });
	}
</script>

{#snippet content()}
	<ChartConfigForm {config} />
{/snippet}

<BaseModal {open} title="Edit Chart" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
