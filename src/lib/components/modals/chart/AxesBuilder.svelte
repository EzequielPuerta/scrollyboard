<script lang="ts">
	import type { ChartConfig, AxisConfig } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	// Scaffold so bindings have targets; buildChartProps() prunes empties later.
	config.scales ??= {};
	config.scales.x ??= {};
	config.scales.y ??= {};
	config.scales.z ??= {};
	config.margins ??= {};

	const scaleTypes = ['auto', 'linear', 'log', 'sqrt', 'pow', 'time', 'point', 'band', 'ordinal'];
	const showZ = $derived(config.chartType === 'heatmap' || config.chartType === 'pyramid');

	const axes = $derived(
		[
			{ key: 'x', cfg: config.scales!.x! },
			{ key: 'y', cfg: config.scales!.y! },
			...(showZ ? [{ key: 'z', cfg: config.scales!.z! }] : [])
		] as { key: string; cfg: AxisConfig }[]
	);
</script>

<div class="flex flex-col gap-3">
	{#each axes as ax (ax.key)}
		<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
			<span class="font-semibold text-sm uppercase">{ax.key} axis</span>
			<div class="grid grid-cols-2 gap-2">
				<label class="text-xs">type
					<select bind:value={ax.cfg.type} class="select select-bordered select-xs w-full">
						{#each scaleTypes as t}<option value={t}>{t}</option>{/each}
					</select>
				</label>
				<label class="text-xs">label
					<input type="text" bind:value={ax.cfg.label} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">domain min
					<input type="number" bind:value={ax.cfg.domainMin} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">domain max
					<input type="number" bind:value={ax.cfg.domainMax} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">tick rotate
					<input type="number" bind:value={ax.cfg.tickRotate} class="input input-bordered input-xs w-full" />
				</label>
				<label class="text-xs">tick spacing
					<input type="number" bind:value={ax.cfg.tickSpacing} class="input input-bordered input-xs w-full" />
				</label>
			</div>
			<div class="flex flex-wrap gap-3 text-xs">
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={ax.cfg.grid} class="checkbox checkbox-xs" /> grid</label>
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={ax.cfg.nice} class="checkbox checkbox-xs" /> nice</label>
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={ax.cfg.zero} class="checkbox checkbox-xs" /> zero</label>
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={ax.cfg.reverse} class="checkbox checkbox-xs" /> reverse</label>
				<label class="flex items-center gap-1"><input type="checkbox" bind:checked={ax.cfg.percent} class="checkbox checkbox-xs" /> percent</label>
			</div>
		</div>
	{/each}

	<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
		<span class="font-semibold text-sm">Margins</span>
		<div class="grid grid-cols-4 gap-2">
			<label class="text-xs">top
				<input type="number" bind:value={config.margins!.top} class="input input-bordered input-xs w-full" />
			</label>
			<label class="text-xs">right
				<input type="number" bind:value={config.margins!.right} class="input input-bordered input-xs w-full" />
			</label>
			<label class="text-xs">bottom
				<input type="number" bind:value={config.margins!.bottom} class="input input-bordered input-xs w-full" />
			</label>
			<label class="text-xs">left
				<input type="number" bind:value={config.margins!.left} class="input input-bordered input-xs w-full" />
			</label>
		</div>
	</div>
</div>
