<script lang="ts">
	import type { ChartConfig } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	config.styles ??= {};
	config.styles.values ??= {};
	config.styles.colors ??= {};

	const anchors = ['', 'outside', 'start', 'middle', 'end'];
	const showColors = $derived(config.chartType === 'heatmap' || config.chartType === 'pyramid');
</script>

<div class="flex flex-col gap-3">
	<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
		<span class="font-semibold text-sm">Value labels</span>
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" bind:checked={config.styles!.values!.show} class="checkbox checkbox-sm" />
			Show values on marks
		</label>
		<div class="grid grid-cols-3 gap-2">
			<label class="text-xs">anchor
				<select bind:value={config.styles!.values!.anchor} class="select select-bordered select-xs w-full">
					{#each anchors as a}<option value={a}>{a || '—'}</option>{/each}
				</select>
			</label>
			<label class="text-xs">dx
				<input type="number" bind:value={config.styles!.values!.dx} class="input input-bordered input-xs w-full" />
			</label>
			<label class="text-xs">dy
				<input type="number" bind:value={config.styles!.values!.dy} class="input input-bordered input-xs w-full" />
			</label>
		</div>
	</div>

	{#if showColors}
		<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
			<span class="font-semibold text-sm">Colors</span>
			{#if config.chartType === 'heatmap'}
				<div class="grid grid-cols-2 gap-2">
					<label class="text-xs">min ramp
						<input type="color" bind:value={config.styles!.colors!.min} class="w-full h-7 rounded" />
					</label>
					<label class="text-xs">max ramp
						<input type="color" bind:value={config.styles!.colors!.max} class="w-full h-7 rounded" />
					</label>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-2">
					<label class="text-xs">left side
						<input type="color" bind:value={config.styles!.colors!.left} class="w-full h-7 rounded" />
					</label>
					<label class="text-xs">right side
						<input type="color" bind:value={config.styles!.colors!.right} class="w-full h-7 rounded" />
					</label>
				</div>
			{/if}
		</div>
	{/if}
</div>
