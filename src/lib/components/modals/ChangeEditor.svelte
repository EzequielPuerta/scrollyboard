<script lang="ts">
	import SegmentsBuilder from './chart/SegmentsBuilder.svelte';
	import MarkersBuilder from './chart/MarkersBuilder.svelte';
	import type { StepChange } from '$lib/types/scrolly';

	interface Props {
		change: StepChange;
		chartType: string;
	}

	let { change, chartType }: Props = $props();

	// The existing builders read/write config.segments | config.markers; give
	// them a wrapper and sync edits back into the trigger change.
	let cfg = $state<any>({
		chartType,
		segments: change.target === 'segments' ? change.segments : undefined,
		markers: change.target === 'markers' ? change.markers : undefined
	});

	$effect(() => {
		if (change.target === 'segments') change.segments = cfg.segments ?? {};
		else change.markers = cfg.markers ?? [];
	});
</script>

{#if change.target === 'segments'}
	<SegmentsBuilder config={cfg} />
{:else}
	<MarkersBuilder config={cfg} />
{/if}
