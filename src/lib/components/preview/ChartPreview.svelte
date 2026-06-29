<script lang="ts">
	import {
		LineChart,
		BarChart,
		HeatmapChart,
		PyramidChart,
		LinePlot,
		BarPlot,
		HeatmapPlot,
		PyramidPlot,
		DeltaMarker,
		PeakMarker
	} from '@fundar/data-chart-telling';
	import { onMount, getContext } from 'svelte';
	import type { ChartConfig } from '$lib/chart-config';
	import { parseCsvRows, buildChartProps, mapMarkers } from '$lib/chart-config';
	import { resolveCssVar } from '$lib/scrolly-css';

	const colorsCtx = getContext<{ value: Record<string, string> }>('scrollyColors');

	// Deep-replace any `var(--x)` color strings with their real value so the SVG
	// chart renders them (svelteplot would not resolve a CSS var in an attribute).
	function resolveColors(v: unknown, map: Record<string, string>): any {
		if (typeof v === 'string') return resolveCssVar(v, map);
		if (Array.isArray(v)) return v.map((x) => resolveColors(x, map));
		if (v && typeof v === 'object') {
			const o: Record<string, unknown> = {};
			for (const k in v as Record<string, unknown>) o[k] = resolveColors((v as any)[k], map);
			return o;
		}
		return v;
	}

	interface Props {
		config: ChartConfig;
		width?: number;
		height?: number;
	}

	const { config, width, height }: Props = $props();

	// svelteplot measures the DOM; only render it on the client.
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const rows = $derived(parseCsvRows(config.csvData));
	const props = $derived.by(() => {
		const map = colorsCtx?.value ?? {};
		// Resolve color vars on the serializable parts before building props.
		const rconfig: ChartConfig = {
			...config,
			segments: resolveColors(config.segments, map),
			markers: resolveColors(config.markers, map),
			styles: resolveColors(config.styles, map)
		};
		const p = buildChartProps(rconfig, rows);
		if (width) p.width = width;
		if (height) p.height = height;
		// Replace serialized delta/peak markers with their actual components.
		if (p.markers)
			p.markers = mapMarkers(p.markers as any[], { DeltaMarker, PeakMarker }, { x: config.x, y: config.y });
		return p;
	});

	const needsZ = $derived(config.chartType === 'heatmap' || config.chartType === 'pyramid');
	const ready = $derived(rows.length > 0 && !!config.x && !!config.y && (!needsZ || !!config.z));

	// Select the component for the current type + mode.
	const Component = $derived.by(() => {
		const isChart = config.variant === 'chart';
		switch (config.chartType) {
			case 'bar':
				return isChart ? BarChart : BarPlot;
			case 'heatmap':
				return isChart ? HeatmapChart : HeatmapPlot;
			case 'pyramid':
				return isChart ? PyramidChart : PyramidPlot;
			default:
				return isChart ? LineChart : LinePlot;
		}
	});
</script>

{#if !config.csvData?.trim()}
	<div class="alert alert-info w-full max-w-md"><span>Add CSV data to render the chart.</span></div>
{:else if rows.length === 0}
	<div class="alert alert-warning w-full max-w-md"><span>Could not parse the CSV data.</span></div>
{:else if !ready}
	<div class="alert alert-warning w-full max-w-md">
		<span>Select {needsZ ? 'X, Y and Z' : 'X and Y'} columns to render the chart.</span>
	</div>
{:else if mounted}
	<svelte:boundary>
		{#key `${config.chartType}-${config.variant}`}
			<Component {...props} />
		{/key}
		{#snippet failed(error)}
			<div class="alert alert-error w-full max-w-md text-xs">
				<span>Chart error: {(error as Error)?.message ?? 'check the configuration'}</span>
			</div>
		{/snippet}
	</svelte:boundary>
{:else}
	<div class="skeleton w-full" style={`height:${height ?? config.height ?? 400}px`}></div>
{/if}
