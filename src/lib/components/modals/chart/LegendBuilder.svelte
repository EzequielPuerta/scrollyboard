<script lang="ts">
	import type { ChartConfig, LegendSection } from '$lib/chart-config';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	// snapshot() unwraps $state proxies to plain objects (structuredClone throws
	// on a proxy) and gives a mutable copy.
	let sections = $state<any[]>($state.snapshot(config.legend ?? []) as any[]);

	function clean(v: unknown) {
		return v === '' || v === undefined || v === null ? undefined : v;
	}

	$effect(() => {
		const out: LegendSection[] = sections.map((s) => {
			if (s.type === 'continuous') {
				return {
					type: 'continuous',
					title: clean(s.title) as string | undefined,
					min: Number(s.min) || 0,
					max: Number(s.max) || 0,
					colorMin: clean(s.colorMin) as string | undefined,
					colorMax: clean(s.colorMax) as string | undefined
				};
			}
			return {
				type: 'discrete',
				title: clean(s.title) as string | undefined,
				columns: clean(s.columns) as number | undefined,
				items: (s.items ?? [])
					.filter((it: any) => clean(it.name))
					.map((it: any) => ({
						name: it.name,
						label: clean(it.label),
						color: clean(it.color),
						symbol: clean(it.symbol)
					}))
			};
		});
		config.legend = out.length ? out : undefined;
	});

	function addDiscrete() {
		sections.push({ type: 'discrete', title: '', items: [{ name: '', color: '#888888', symbol: 'circle' }] });
	}
	function addContinuous() {
		sections.push({ type: 'continuous', title: '', min: 0, max: 100, colorMin: '#eeeeee', colorMax: '#333333' });
	}
	function removeSection(i: number) {
		sections.splice(i, 1);
	}
	function addItem(s: any) {
		s.items.push({ name: '', color: '#888888', symbol: 'circle' });
	}
	function removeItem(s: any, j: number) {
		s.items.splice(j, 1);
	}

	const symbols = ['circle', 'square', 'triangle', 'line'];
</script>

<div class="flex flex-col gap-3">
	<div class="flex gap-1">
		<button type="button" onclick={addDiscrete} class="btn btn-xs btn-ghost">+ Discrete</button>
		<button type="button" onclick={addContinuous} class="btn btn-xs btn-ghost">+ Continuous</button>
	</div>

	{#each sections as s, i (i)}
		<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
			<div class="flex justify-between items-center">
				<span class="badge badge-sm">{s.type}</span>
				<button type="button" onclick={() => removeSection(i)} class="btn btn-xs btn-ghost text-error">✕</button>
			</div>
			<input type="text" bind:value={s.title} placeholder="Legend title" class="input input-bordered input-xs w-full" />

			{#if s.type === 'discrete'}
				{#each s.items as it, j (j)}
					<div class="grid grid-cols-[1fr_1fr_auto_auto] gap-1 items-center">
						<input type="text" bind:value={it.name} placeholder="name" class="input input-bordered input-xs w-full" />
						<input type="text" bind:value={it.label} placeholder="label" class="input input-bordered input-xs w-full" />
						<input type="color" bind:value={it.color} class="w-8 h-7 rounded" />
						<select bind:value={it.symbol} class="select select-bordered select-xs">
							{#each symbols as sy}<option value={sy}>{sy}</option>{/each}
						</select>
					</div>
					<button type="button" onclick={() => removeItem(s, j)} class="btn btn-xs btn-ghost text-error self-start">remove item</button>
				{/each}
				<button type="button" onclick={() => addItem(s)} class="btn btn-xs btn-ghost self-start">+ Item</button>
			{:else}
				<div class="grid grid-cols-2 gap-2">
					<label class="text-xs">min<input type="number" bind:value={s.min} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">max<input type="number" bind:value={s.max} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">color min<input type="color" bind:value={s.colorMin} class="w-full h-7 rounded" /></label>
					<label class="text-xs">color max<input type="color" bind:value={s.colorMax} class="w-full h-7 rounded" /></label>
				</div>
			{/if}
		</div>
	{/each}
</div>
