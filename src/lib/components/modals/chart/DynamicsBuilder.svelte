<script lang="ts">
	import type { ChartConfig } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
		columns: string[];
	}

	let { config, columns }: Props = $props();

	let facetOn = $state(Boolean(config.facet?.by));
	let timelineOn = $state(Boolean(config.timeline?.accessor));

	config.facet ??= { by: '' };
	config.timeline ??= { accessor: '', progress: 1 };

	$effect(() => {
		config.facet = facetOn && config.facet!.by ? { ...config.facet! } : undefined;
	});
	$effect(() => {
		config.timeline =
			timelineOn && config.timeline!.accessor ? { ...config.timeline! } : undefined;
	});
</script>

<div class="flex flex-col gap-3">
	<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
		<label class="flex items-center gap-2 text-sm font-semibold">
			<input type="checkbox" bind:checked={facetOn} class="checkbox checkbox-sm" /> Facet (small multiples)
		</label>
		{#if facetOn}
			<div class="grid grid-cols-3 gap-2">
				<label class="text-xs">by column
					<select bind:value={config.facet!.by} class="select select-bordered select-xs w-full">
						<option value="">—</option>
						{#each columns as c}<option value={c}>{c}</option>{/each}
					</select>
				</label>
				<label class="text-xs">columns
					<input type="number" bind:value={config.facet!.columns} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">gap
					<input type="number" bind:value={config.facet!.gap} class="input input-bordered input-xs w-full" />
				</label>
			</div>
		{/if}
	</div>

	<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
		<label class="flex items-center gap-2 text-sm font-semibold">
			<input type="checkbox" bind:checked={timelineOn} class="checkbox checkbox-sm" /> Timeline (animated reveal)
		</label>
		{#if timelineOn}
			<div class="grid grid-cols-2 gap-2">
				<label class="text-xs">accessor column
					<select bind:value={config.timeline!.accessor} class="select select-bordered select-xs w-full">
						<option value="">—</option>
						{#each columns as c}<option value={c}>{c}</option>{/each}
					</select>
				</label>
				<label class="text-xs">progress (0–1)
					<input type="number" step="0.05" min="0" max="1" bind:value={config.timeline!.progress} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">orientation
					<select bind:value={config.timeline!.orientation} class="select select-bordered select-xs w-full">
						<option value="horizontal">horizontal</option>
						<option value="vertical">vertical</option>
					</select>
				</label>
				<label class="text-xs">filter mode
					<select bind:value={config.timeline!.filterMode} class="select select-bordered select-xs w-full">
						<option value="upTo">up to</option>
						<option value="exact">exact</option>
					</select>
				</label>
			</div>
			<div class="flex gap-4 text-xs">
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={config.timeline!.show} class="checkbox checkbox-xs" /> show scrubber</label>
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={config.timeline!.interpolate} class="checkbox checkbox-xs" /> interpolate</label>
			</div>
		{/if}
	</div>
</div>
