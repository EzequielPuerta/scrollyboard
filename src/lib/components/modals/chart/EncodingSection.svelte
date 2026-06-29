<script lang="ts">
	import type { ChartConfig } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
		columns: string[];
	}

	let { config, columns }: Props = $props();

	const needsZ = $derived(config.chartType === 'heatmap' || config.chartType === 'pyramid');
</script>

<div class="flex flex-col gap-4">
	<div class="grid grid-cols-2 gap-3">
		<div>
			<label class="label"><span class="label-text font-semibold">Mode</span></label>
			<select bind:value={config.variant} class="select select-bordered w-full">
				<option value="chart">Chart (title, legend, …)</option>
				<option value="plot">Plot (minimal marks)</option>
			</select>
		</div>
		<div>
			<label class="label"><span class="label-text font-semibold">Chart type</span></label>
			<select bind:value={config.chartType} class="select select-bordered w-full">
				<option value="line">Line</option>
				<option value="bar">Bar</option>
				<option value="heatmap">Heatmap</option>
				<option value="pyramid">Pyramid</option>
			</select>
		</div>
	</div>

	{#if !columns.length}
		<div class="alert alert-info text-xs">
			<span>Load a CSV in the <b>CSV</b> tab to map columns.</span>
		</div>
	{/if}

	<div class="grid grid-cols-3 gap-3">
		<div>
			<label class="label"><span class="label-text font-semibold">X</span></label>
			<select bind:value={config.x} class="select select-bordered select-sm w-full">
				<option value="">—</option>
				{#each columns as col}<option value={col}>{col}</option>{/each}
			</select>
		</div>
		<div>
			<label class="label"><span class="label-text font-semibold">Y</span></label>
			<select bind:value={config.y} class="select select-bordered select-sm w-full">
				<option value="">—</option>
				{#each columns as col}<option value={col}>{col}</option>{/each}
			</select>
		</div>
		<div>
			<label class="label">
				<span class="label-text font-semibold">Z{needsZ ? ' *' : ''}</span>
			</label>
			<select bind:value={config.z} class="select select-bordered select-sm w-full">
				<option value="">—</option>
				{#each columns as col}<option value={col}>{col}</option>{/each}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div>
			<label class="label"><span class="label-text font-semibold">Width</span></label>
			<input type="number" bind:value={config.width} class="input input-bordered input-sm w-full" />
		</div>
		<div>
			<label class="label"><span class="label-text font-semibold">Height</span></label>
			<input type="number" bind:value={config.height} class="input input-bordered input-sm w-full" />
		</div>
	</div>

	{#if config.variant === 'chart'}
		<div class="flex flex-col gap-2">
			<input type="text" bind:value={config.title} placeholder="Title" class="input input-bordered input-sm w-full" />
			<input type="text" bind:value={config.subtitle} placeholder="Subtitle" class="input input-bordered input-sm w-full" />
			<input type="text" bind:value={config.caption} placeholder="Caption / source" class="input input-bordered input-sm w-full" />
		</div>
	{/if}
</div>
