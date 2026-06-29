<script lang="ts">
	import type { ChartConfig, Marker } from '$lib/chart-config';
	import ColorField from './ColorField.svelte';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	// Bind against a fully-scaffolded array so every nested object exists.
	// snapshot() unwraps the $state proxies into plain objects (structuredClone
	// would throw on a proxy), and gives us a copy that's safe to mutate.
	let markers = $state<any[]>(($state.snapshot(config.markers ?? []) as any[]).map((m) => scaffold(m)));

	function scaffold(m: any) {
		m.style ??= {};
		m.ruleStyle ??= {};
		m.dotStyle ??= {};
		m.fontStyle ??= {};
		m.textStyle ??= {};
		m.strokeStyle ??= {};
		m.from ??= { type: 'series', series: '' };
		m.to ??= { type: 'series', series: '' };
		m._ui ??= {
			strokeColor: m.strokeStyle?.stroke != null || m.style?.stroke != null,
			fontColor: m.fontStyle?.fill != null,
			dotFill: m.dotStyle?.dotFill != null,
			textFill: m.textStyle?.fill != null,
			toEnabled: m.type === 'delta' && m.to && (m.to.series || m.to.value != null)
		};
		return m;
	}

	function clean(v: unknown) {
		return v === '' || v === undefined || v === null ? undefined : v;
	}
	function nonEmpty(o: Record<string, unknown>) {
		const e = Object.fromEntries(Object.entries(o).filter(([, v]) => clean(v) !== undefined));
		return Object.keys(e).length ? e : undefined;
	}
	function numberish(v: any) {
		const n = Number(v);
		return v !== '' && v != null && !Number.isNaN(n) ? n : v;
	}
	function target(t: any) {
		return t?.type === 'axis'
			? { type: 'axis', value: clean(numberish(t.value)) }
			: { type: 'series', series: t?.series || '' };
	}

	$effect(() => {
		const out: Marker[] = [];
		for (const m of markers) {
			if (m.type === 'ruleX') {
				if (clean(m.x) === undefined) continue;
				out.push({ type: 'ruleX', x: numberish(m.x), style: nonEmpty(m.style) } as Marker);
			} else if (m.type === 'ruleY') {
				if (clean(m.y) === undefined) continue;
				out.push({ type: 'ruleY', y: numberish(m.y), style: nonEmpty(m.style) } as Marker);
			} else if (m.type === 'delta') {
				out.push({
					type: 'delta',
					series: (clean(m.series) as string) || 'series',
					scope: m.scope || undefined,
					axis: m.axis || 'y',
					at: numberish(m.at),
					from: target(m.from),
					to: m._ui.toEnabled ? target(m.to) : undefined,
					strokeStyle: nonEmpty({
						stroke: m._ui.strokeColor ? clean(m.strokeStyle.stroke) : undefined,
						strokeWidth: clean(m.strokeStyle.strokeWidth)
					}),
					fontStyle: nonEmpty({
						fontSize: clean(m.fontStyle.fontSize),
						fill: m._ui.fontColor ? clean(m.fontStyle.fill) : undefined
					}),
					dotStyle: nonEmpty({
						dotRadius: clean(m.dotStyle.dotRadius),
						dotFill: m._ui.dotFill ? clean(m.dotStyle.dotFill) : undefined
					})
				} as Marker);
			} else if (m.type === 'peak') {
				out.push({
					type: 'peak',
					series: (clean(m.series) as string) || 'series',
					scope: m.scope || undefined,
					mode: m.mode || 'max',
					label: clean(m.label) as string | undefined,
					xProp: clean(m.xProp) as string | undefined,
					yProp: clean(m.yProp) as string | undefined,
					dotStyle: nonEmpty({
						dotRadius: clean(m.dotStyle.dotRadius),
						dotFill: m._ui.dotFill ? clean(m.dotStyle.dotFill) : undefined
					}),
					textStyle: nonEmpty({
						fontSize: clean(m.textStyle.fontSize),
						fill: m._ui.textFill ? clean(m.textStyle.fill) : undefined
					})
				} as Marker);
			} else {
				out.push({
					type: 'hover',
					series: clean(m.series) as string | undefined,
					scope: m.scope || undefined,
					sync: m.sync || undefined,
					ruleX: m.ruleX || undefined,
					ruleY: m.ruleY || undefined,
					showLabels: m.showLabels || undefined,
					ruleStyle: nonEmpty(m.ruleStyle),
					dotStyle: nonEmpty(m.dotStyle),
					fontStyle: nonEmpty(m.fontStyle)
				} as Marker);
			}
		}
		config.markers = out.length ? out : undefined;
	});

	function add(type: string) {
		markers.push(
			scaffold({ type, x: '', y: '', at: '', series: 'series', scope: 'series', axis: 'y', mode: 'max' })
		);
	}
	function remove(i: number) {
		markers.splice(i, 1);
	}
	function toggleColor(e: Event, m: any, flag: string, set: (c: string) => void, get: () => unknown) {
		const on = (e.target as HTMLInputElement).checked;
		m._ui[flag] = on;
		if (on && !get()) set('#ef4444');
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex flex-wrap gap-1">
		<button type="button" onclick={() => add('ruleX')} class="btn btn-xs btn-ghost">+ Rule X</button>
		<button type="button" onclick={() => add('ruleY')} class="btn btn-xs btn-ghost">+ Rule Y</button>
		<button type="button" onclick={() => add('hover')} class="btn btn-xs btn-ghost">+ Hover</button>
		<button type="button" onclick={() => add('delta')} class="btn btn-xs btn-ghost">+ Delta</button>
		<button type="button" onclick={() => add('peak')} class="btn btn-xs btn-ghost">+ Peak</button>
	</div>

	{#each markers as m, i (i)}
		<div class="border border-base-300 rounded-lg p-2 flex flex-col gap-2">
			<div class="flex justify-between items-center">
				<span class="badge badge-sm">{m.type}</span>
				<button type="button" onclick={() => remove(i)} class="btn btn-xs btn-ghost text-error">✕</button>
			</div>

			{#if m.type === 'ruleX' || m.type === 'ruleY'}
				<div class="grid grid-cols-3 gap-1 items-end">
					<label class="text-xs">{m.type === 'ruleX' ? 'x' : 'y'} value
						{#if m.type === 'ruleX'}
							<input type="text" bind:value={m.x} class="input input-bordered input-xs w-full" />
						{:else}
							<input type="text" bind:value={m.y} class="input input-bordered input-xs w-full" />
						{/if}
					</label>
					<label class="text-xs">color<ColorField value={m.style.stroke} onChange={(c) => (m.style.stroke = c)} /></label>
					<label class="text-xs">width<input type="number" bind:value={m.style.strokeWidth} class="input input-bordered input-xs w-full" /></label>
				</div>

			{:else if m.type === 'hover'}
				<div class="grid grid-cols-2 gap-1 items-end">
					<label class="text-xs">series (optional)<input type="text" bind:value={m.series} placeholder="all" class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">scope
						<select bind:value={m.scope} class="select select-bordered select-xs w-full"><option value="series">series</option><option value="segment">segment</option></select>
					</label>
				</div>
				<div class="flex flex-wrap gap-3 text-xs">
					<label class="flex items-center gap-1"><input type="checkbox" bind:checked={m.ruleX} class="checkbox checkbox-xs" /> rule X</label>
					<label class="flex items-center gap-1"><input type="checkbox" bind:checked={m.ruleY} class="checkbox checkbox-xs" /> rule Y</label>
					<label class="flex items-center gap-1"><input type="checkbox" bind:checked={m.showLabels} class="checkbox checkbox-xs" /> labels</label>
					<label class="flex items-center gap-1"><input type="checkbox" bind:checked={m.sync} class="checkbox checkbox-xs" /> sync facets</label>
				</div>

			{:else if m.type === 'delta'}
				<div class="grid grid-cols-2 gap-1 items-end">
					<label class="text-xs">series<input type="text" bind:value={m.series} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">axis
						<select bind:value={m.axis} class="select select-bordered select-xs w-full"><option value="y">y</option><option value="x">x</option></select>
					</label>
					<label class="text-xs">at (value)<input type="text" bind:value={m.at} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">scope
						<select bind:value={m.scope} class="select select-bordered select-xs w-full"><option value="series">series</option><option value="segment">segment</option></select>
					</label>
				</div>
				<div class="grid grid-cols-2 gap-2 items-end pl-2 border-l-2 border-base-300">
					<div class="text-xs">from
						<select bind:value={m.from.type} class="select select-bordered select-xs w-full"><option value="series">series</option><option value="axis">axis</option></select>
						{#if m.from.type === 'axis'}<input type="number" bind:value={m.from.value} placeholder="value" class="input input-bordered input-xs w-full mt-1" />
						{:else}<input type="text" bind:value={m.from.series} placeholder="series name" class="input input-bordered input-xs w-full mt-1" />{/if}
					</div>
					<div class="text-xs">
						<label class="flex items-center gap-1"><input type="checkbox" bind:checked={m._ui.toEnabled} class="checkbox checkbox-xs" /> to</label>
						{#if m._ui.toEnabled}
							<select bind:value={m.to.type} class="select select-bordered select-xs w-full mt-1"><option value="series">series</option><option value="axis">axis</option></select>
							{#if m.to.type === 'axis'}<input type="number" bind:value={m.to.value} placeholder="value" class="input input-bordered input-xs w-full mt-1" />
							{:else}<input type="text" bind:value={m.to.series} placeholder="series name" class="input input-bordered input-xs w-full mt-1" />{/if}
						{/if}
					</div>
				</div>
				<div class="grid grid-cols-3 gap-2 items-end">
					<label class="text-xs flex flex-col gap-1"><span class="flex items-center gap-1"><input type="checkbox" checked={m._ui.strokeColor} class="checkbox checkbox-xs" onchange={(e) => toggleColor(e, m, 'strokeColor', (c) => (m.strokeStyle.stroke = c), () => m.strokeStyle.stroke)} /> stroke</span><ColorField value={m.strokeStyle.stroke} disabled={!m._ui.strokeColor} onChange={(c) => (m.strokeStyle.stroke = c)} /></label>
					<label class="text-xs">width<input type="number" bind:value={m.strokeStyle.strokeWidth} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">font size<input type="number" bind:value={m.fontStyle.fontSize} class="input input-bordered input-xs w-full" /></label>
				</div>

			{:else if m.type === 'peak'}
				<div class="grid grid-cols-2 gap-1 items-end">
					<label class="text-xs">series<input type="text" bind:value={m.series} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs">mode
						<select bind:value={m.mode} class="select select-bordered select-xs w-full"><option value="max">max</option><option value="min">min</option></select>
					</label>
					<label class="text-xs col-span-2">label<input type="text" bind:value={m.label} placeholder="optional annotation" class="input input-bordered input-xs w-full" /></label>
				</div>
				<div class="grid grid-cols-3 gap-2 items-end">
					<label class="text-xs">dot radius<input type="number" bind:value={m.dotStyle.dotRadius} class="input input-bordered input-xs w-full" /></label>
					<label class="text-xs flex flex-col gap-1"><span class="flex items-center gap-1"><input type="checkbox" checked={m._ui.dotFill} class="checkbox checkbox-xs" onchange={(e) => toggleColor(e, m, 'dotFill', (c) => (m.dotStyle.dotFill = c), () => m.dotStyle.dotFill)} /> dot fill</span><ColorField value={m.dotStyle.dotFill} disabled={!m._ui.dotFill} onChange={(c) => (m.dotStyle.dotFill = c)} /></label>
					<label class="text-xs flex flex-col gap-1"><span class="flex items-center gap-1"><input type="checkbox" checked={m._ui.textFill} class="checkbox checkbox-xs" onchange={(e) => toggleColor(e, m, 'textFill', (c) => (m.textStyle.fill = c), () => m.textStyle.fill)} /> text</span><ColorField value={m.textStyle.fill} disabled={!m._ui.textFill} onChange={(c) => (m.textStyle.fill = c)} /></label>
				</div>
			{/if}
		</div>
	{/each}
</div>
