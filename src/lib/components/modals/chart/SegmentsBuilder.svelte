<script lang="ts">
	import type { ChartConfig, Segments } from '$lib/chart-config';
	import ColorField from './ColorField.svelte';

	interface Props {
		config: ChartConfig;
	}

	let { config }: Props = $props();

	type Group = { key: string; segments: any[] };

	// Scaffold nested objects + UI-only enable flags (inferred from saved data).
	function scaffold(seg: any) {
		seg.areas ??= [{}];
		seg.areas[0] ??= {};
		seg.areas[0].x ??= {};
		seg.areas[0].y ??= {};
		seg.style ??= {};
		seg.style.stroke ??= {};
		seg.style.dots ??= {};
		seg._ui ??= {
			strokeColor: seg.style.stroke?.stroke != null,
			dots: seg.style.dots && Object.keys(seg.style.dots).length > 0,
			dotFill: seg.style.dots?.dotFill != null,
			dotStroke: seg.style.dots?.dotStroke != null,
			fill: seg.style.fill != null
		};
		return seg;
	}

	function recordToGroups(rec?: Segments): Group[] {
		if (!rec) return [];
		return Object.entries(rec).map(([key, segments]) => ({
			key,
			segments: (segments as any[]).map(scaffold)
		}));
	}

	// snapshot() unwraps $state proxies to plain mutable objects.
	let groups = $state<Group[]>(recordToGroups($state.snapshot(config.segments) as Segments));

	function clean(v: unknown) {
		return v === '' || v === undefined || v === null ? undefined : v;
	}
	function prune(o: Record<string, unknown>) {
		const e = Object.fromEntries(Object.entries(o).filter(([, v]) => clean(v) !== undefined));
		return Object.keys(e).length ? e : undefined;
	}

	$effect(() => {
		const rec: Segments = {};
		for (const g of groups) {
			if (!g.key.trim()) continue;
			rec[g.key.trim()] = g.segments.map((seg) => {
				const a = seg.areas?.[0] ?? {};
				const x = { from: clean(a.x?.from), to: clean(a.x?.to) };
				const y = { from: clean(a.y?.from), to: clean(a.y?.to) };
				const out: any = { style: {} };
				if (x.from || x.to || y.from || y.to) out.areas = [{ x, y }];

				const s = seg.style ?? {};
				const ui = seg._ui ?? {};
				if (config.chartType === 'line') {
					const stroke = prune({
						stroke: ui.strokeColor ? clean(s.stroke?.stroke) : undefined,
						strokeWidth: clean(s.stroke?.strokeWidth),
						strokeDasharray: clean(s.stroke?.strokeDasharray)
					});
					if (stroke) out.style.stroke = stroke;
					if (ui.dots) {
						const dots = prune({
							dotRadius: clean(s.dots?.dotRadius),
							dotSymbol: clean(s.dots?.dotSymbol),
							dotFill: ui.dotFill ? clean(s.dots?.dotFill) : undefined,
							dotStroke: ui.dotStroke ? clean(s.dots?.dotStroke) : undefined,
							dotStrokeWidth: clean(s.dots?.dotStrokeWidth)
						});
						if (dots) out.style.dots = dots;
					}
				} else {
					if (ui.fill) out.style.fill = clean(s.fill);
					out.style.fillOpacity = clean(s.fillOpacity);
					if (config.chartType === 'heatmap') out.style.strokeWidth = clean(s.strokeWidth);
					out.style = prune(out.style) ?? {};
				}
				return out;
			});
		}
		config.segments = Object.keys(rec).length ? rec : undefined;
	});

	function addGroup() {
		groups.push({ key: groups.length ? 'series-name' : 'default', segments: [scaffold({})] });
	}
	function removeGroup(i: number) {
		groups.splice(i, 1);
	}
	function addSegment(g: Group) {
		g.segments.push(scaffold({}));
	}
	function removeSegment(g: Group, j: number) {
		g.segments.splice(j, 1);
	}

	// Toggling a color on seeds a default so the picker is not blank/black.
	function toggleColor(e: Event, seg: any, flag: string, setter: (c: string) => void, get: () => unknown) {
		const on = (e.target as HTMLInputElement).checked;
		seg._ui[flag] = on;
		if (on && !get()) setter('#3b82f6');
	}

	const dashOptions = ['', 'solid', 'dashed', 'dotted', 'dashdot'];
	const symbolOptions = ['', 'circle', 'square', 'triangle', 'line'];
</script>

<div class="flex flex-col gap-3">
	<p class="text-xs text-base-content/60">
		Style series by name (or <code>default</code> for all). Leave the range blank for a catch-all.
		Colors are optional — tick the box to set one.
	</p>

	{#each groups as g, i (i)}
		<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
			<div class="flex gap-2 items-center">
				<input type="text" bind:value={g.key} placeholder="series name or 'default'" class="input input-bordered input-sm flex-1 font-mono" />
				<button type="button" onclick={() => removeGroup(i)} class="btn btn-xs btn-ghost text-error">✕</button>
			</div>

			{#each g.segments as seg, j (j)}
				<div class="bg-base-200 rounded p-2 flex flex-col gap-2">
					<div class="grid grid-cols-4 gap-1 items-end">
						<label class="text-xs">x from<input type="text" bind:value={seg.areas[0].x.from} class="input input-bordered input-xs w-full" /></label>
						<label class="text-xs">x to<input type="text" bind:value={seg.areas[0].x.to} class="input input-bordered input-xs w-full" /></label>
						<label class="text-xs">y from<input type="text" bind:value={seg.areas[0].y.from} class="input input-bordered input-xs w-full" /></label>
						<label class="text-xs">y to<input type="text" bind:value={seg.areas[0].y.to} class="input input-bordered input-xs w-full" /></label>
					</div>

					{#if config.chartType === 'line'}
						<div class="grid grid-cols-[auto_1fr_1fr] gap-2 items-end">
							<label class="text-xs flex flex-col gap-1">
								<span class="flex items-center gap-1">
									<input type="checkbox" checked={seg._ui.strokeColor} class="checkbox checkbox-xs"
										onchange={(e) => toggleColor(e, seg, 'strokeColor', (c) => (seg.style.stroke.stroke = c), () => seg.style.stroke.stroke)} />
									stroke
								</span>
								<ColorField value={seg.style.stroke.stroke} disabled={!seg._ui.strokeColor} onChange={(c) => (seg.style.stroke.stroke = c)} />
							</label>
							<label class="text-xs">width<input type="number" bind:value={seg.style.stroke.strokeWidth} class="input input-bordered input-xs w-full" /></label>
							<label class="text-xs">dash
								<select bind:value={seg.style.stroke.strokeDasharray} class="select select-bordered select-xs w-full">
									{#each dashOptions as d}<option value={d}>{d || '—'}</option>{/each}
								</select>
							</label>
						</div>

						<label class="text-xs flex items-center gap-1">
							<input type="checkbox" bind:checked={seg._ui.dots} class="checkbox checkbox-xs" /> dot styling
						</label>
						{#if seg._ui.dots}
							<div class="grid grid-cols-3 gap-2 items-end pl-2 border-l-2 border-base-300">
								<label class="text-xs">radius<input type="number" bind:value={seg.style.dots.dotRadius} class="input input-bordered input-xs w-full" /></label>
								<label class="text-xs">symbol
									<select bind:value={seg.style.dots.dotSymbol} class="select select-bordered select-xs w-full">
										{#each symbolOptions as s}<option value={s}>{s || '—'}</option>{/each}
									</select>
								</label>
								<label class="text-xs">stroke w<input type="number" bind:value={seg.style.dots.dotStrokeWidth} class="input input-bordered input-xs w-full" /></label>
								<label class="text-xs flex flex-col gap-1">
									<span class="flex items-center gap-1">
										<input type="checkbox" checked={seg._ui.dotFill} class="checkbox checkbox-xs"
											onchange={(e) => toggleColor(e, seg, 'dotFill', (c) => (seg.style.dots.dotFill = c), () => seg.style.dots.dotFill)} />
										fill
									</span>
									<ColorField value={seg.style.dots.dotFill} disabled={!seg._ui.dotFill} onChange={(c) => (seg.style.dots.dotFill = c)} />
								</label>
								<label class="text-xs flex flex-col gap-1">
									<span class="flex items-center gap-1">
										<input type="checkbox" checked={seg._ui.dotStroke} class="checkbox checkbox-xs"
											onchange={(e) => toggleColor(e, seg, 'dotStroke', (c) => (seg.style.dots.dotStroke = c), () => seg.style.dots.dotStroke)} />
										stroke
									</span>
									<ColorField value={seg.style.dots.dotStroke} disabled={!seg._ui.dotStroke} onChange={(c) => (seg.style.dots.dotStroke = c)} />
								</label>
							</div>
						{/if}
					{:else}
						<div class="grid grid-cols-3 gap-2 items-end">
							<label class="text-xs flex flex-col gap-1">
								<span class="flex items-center gap-1">
									<input type="checkbox" checked={seg._ui.fill} class="checkbox checkbox-xs"
										onchange={(e) => toggleColor(e, seg, 'fill', (c) => (seg.style.fill = c), () => seg.style.fill)} />
									fill
								</span>
								<ColorField value={seg.style.fill} disabled={!seg._ui.fill} onChange={(c) => (seg.style.fill = c)} />
							</label>
							<label class="text-xs">opacity<input type="number" step="0.1" min="0" max="1" bind:value={seg.style.fillOpacity} class="input input-bordered input-xs w-full" /></label>
							{#if config.chartType === 'heatmap'}
								<label class="text-xs">stroke w<input type="number" bind:value={seg.style.strokeWidth} class="input input-bordered input-xs w-full" /></label>
							{/if}
						</div>
					{/if}

					<button type="button" onclick={() => removeSegment(g, j)} class="btn btn-xs btn-ghost text-error self-start">Remove segment</button>
				</div>
			{/each}

			<button type="button" onclick={() => addSegment(g)} class="btn btn-xs btn-ghost self-start">+ Segment</button>
		</div>
	{/each}

	<button type="button" onclick={addGroup} class="btn btn-sm btn-ghost self-start">+ Series style</button>
</div>
