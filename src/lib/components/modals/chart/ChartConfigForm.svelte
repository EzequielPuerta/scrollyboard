<script lang="ts">
	import type { ChartConfig } from '$lib/chart-config';
	import { csvColumns } from '$lib/chart-config';
	import CsvSection from './CsvSection.svelte';
	import EncodingSection from './EncodingSection.svelte';
	import SegmentsBuilder from './SegmentsBuilder.svelte';
	import MarkersBuilder from './MarkersBuilder.svelte';
	import AxesBuilder from './AxesBuilder.svelte';
	import StylesBuilder from './StylesBuilder.svelte';
	import LegendBuilder from './LegendBuilder.svelte';
	import DynamicsBuilder from './DynamicsBuilder.svelte';
	import ChartPreview from '$lib/components/preview/ChartPreview.svelte';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	const columns = $derived(csvColumns(config.csvData));
	const isChart = $derived(config.variant === 'chart');

	// Unique radio group so two forms (standalone + scene) never collide.
	const group = `chart-tabs-${Math.random().toString(36).slice(2)}`;

	// Live preview: scale the configured size down proportionally to fit a small
	// box so it never grows too large (never upscaled past the real size).
	const PREVIEW_MAX_W = 460;
	const PREVIEW_MAX_H = 340;
	const previewDims = $derived.by(() => {
		const w = config.width ?? 600;
		const h = config.height ?? 400;
		const scale = Math.min(PREVIEW_MAX_W / w, PREVIEW_MAX_H / h, 1);
		return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
	});
</script>

<div class="flex flex-col md:flex-row gap-4">
	<!-- Left: tabbed options -->
	<div class="w-full md:w-3/5 min-w-0">
		<div class="tabs tabs-lift">
			<input type="radio" name={group} class="tab" aria-label="CSV" checked />
			<div class="tab-content border-base-300 bg-base-100 p-3">
				<CsvSection {config} />
			</div>

			<input type="radio" name={group} class="tab" aria-label="General" />
			<div class="tab-content border-base-300 bg-base-100 p-3">
				<EncodingSection {config} {columns} />
			</div>

			<input type="radio" name={group} class="tab" aria-label="Segments" />
			<div class="tab-content border-base-300 bg-base-100 p-3"><SegmentsBuilder {config} /></div>

			<input type="radio" name={group} class="tab" aria-label="Markers" />
			<div class="tab-content border-base-300 bg-base-100 p-3"><MarkersBuilder {config} /></div>

			<input type="radio" name={group} class="tab" aria-label="Axes" />
			<div class="tab-content border-base-300 bg-base-100 p-3"><AxesBuilder {config} /></div>

			<input type="radio" name={group} class="tab" aria-label="Styles" />
			<div class="tab-content border-base-300 bg-base-100 p-3"><StylesBuilder {config} /></div>

			{#if isChart}
				<input type="radio" name={group} class="tab" aria-label="Legend" />
				<div class="tab-content border-base-300 bg-base-100 p-3"><LegendBuilder {config} /></div>

				<input type="radio" name={group} class="tab" aria-label="Facet" />
				<div class="tab-content border-base-300 bg-base-100 p-3">
					<DynamicsBuilder {config} {columns} />
				</div>
			{/if}
		</div>
	</div>

	<!-- Right: live preview, sticky so it stays in view while scrolling -->
	<aside class="w-full md:w-2/5 md:max-w-md md:sticky md:top-0 self-start">
		<div class="text-xs font-semibold text-base-content/60 mb-1">Live preview</div>
		<div
			class="chart-host flex justify-center items-center overflow-auto min-h-64 max-h-96 bg-base-200/40 rounded-lg p-3 border border-base-300"
		>
			<ChartPreview {config} width={previewDims.width} height={previewDims.height} />
		</div>
	</aside>
</div>

<style>
	/* Keep the live preview chart within its column width. */
	.chart-host :global(svg) {
		max-width: 100%;
		height: auto;
	}
</style>
