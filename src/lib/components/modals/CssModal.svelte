<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import { TYPO_SELECTORS } from '$lib/scrolly-css';
	import type { ScrollyCss, ColorVar, TypographyStyle } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: ScrollyCss;
		onClose: () => void;
		onSave: (css: ScrollyCss) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let colorVars = $state<ColorVar[]>(
		data?.colorVars ? ($state.snapshot(data.colorVars) as ColorVar[]) : []
	);
	let typography = $state<Record<string, TypographyStyle>>(
		data?.typography ? ($state.snapshot(data.typography) as Record<string, TypographyStyle>) : {}
	);
	for (const s of TYPO_SELECTORS) typography[s] ??= {};

	const weights = ['', '300', '400', '500', '600', '700', '800', '900'];

	function addVar() {
		colorVars.push({ name: `color${colorVars.length + 1}`, value: '#888888' });
	}
	function removeVar(i: number) {
		colorVars.splice(i, 1);
	}

	function clean(t: TypographyStyle): TypographyStyle | undefined {
		const o: TypographyStyle = {};
		if (t.fontSize?.trim()) o.fontSize = t.fontSize.trim();
		if (t.lineHeight?.trim()) o.lineHeight = t.lineHeight.trim();
		if (t.fontWeight) o.fontWeight = t.fontWeight;
		if (t.letterSpacing?.trim()) o.letterSpacing = t.letterSpacing.trim();
		if (t.color?.trim()) o.color = t.color.trim();
		return Object.keys(o).length ? o : undefined;
	}

	function save() {
		const typo: Record<string, TypographyStyle> = {};
		for (const s of TYPO_SELECTORS) {
			const c = clean(typography[s]);
			if (c) typo[s] = c;
		}
		onSave({
			colorVars: colorVars.filter((v) => v.name.trim() && v.value),
			typography: typo
		});
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<div class="flex justify-between items-center mb-1">
				<span class="label-text font-semibold">Color variables</span>
				<button type="button" onclick={addVar} class="btn btn-xs btn-primary">+ Add</button>
			</div>
			<p class="text-xs text-base-content/50 mb-2">
				Reference anywhere as <span class="font-mono">var(--name)</span> — including chart strokes/fills.
			</p>
			<div class="flex flex-col gap-2">
				{#each colorVars as v, i (i)}
					<div class="flex items-center gap-2">
						<span class="text-base-content/40 font-mono text-xs">--</span>
						<input
							type="text"
							bind:value={v.name}
							placeholder="name"
							class="input input-bordered input-sm flex-1 font-mono"
						/>
						<input type="color" bind:value={v.value} class="w-10 h-8 rounded" />
						<input type="text" bind:value={v.value} class="input input-bordered input-sm w-28 font-mono" />
						<button type="button" onclick={() => removeVar(i)} class="btn btn-xs btn-ghost text-error">✕</button>
					</div>
				{/each}
				{#if colorVars.length === 0}
					<p class="text-xs text-base-content/50">No variables yet.</p>
				{/if}
			</div>
		</div>

		<div>
			<span class="label-text font-semibold">Typography</span>
			<p class="text-xs text-base-content/50 mb-2">
				Leave a field empty to keep the default. Color accepts <span class="font-mono">var(--name)</span>.
			</p>
			<div class="overflow-x-auto">
				<table class="table table-xs">
					<thead>
						<tr>
							<th></th>
							<th>Font size</th>
							<th>Line height</th>
							<th>Weight</th>
							<th>Letter spacing</th>
							<th>Color</th>
						</tr>
					</thead>
					<tbody>
						{#each TYPO_SELECTORS as sel (sel)}
							<tr>
								<td class="font-mono font-semibold">{sel}</td>
								<td><input type="text" bind:value={typography[sel].fontSize} placeholder="2rem" class="input input-bordered input-xs w-24" /></td>
								<td><input type="text" bind:value={typography[sel].lineHeight} placeholder="1.4" class="input input-bordered input-xs w-20" /></td>
								<td>
									<select bind:value={typography[sel].fontWeight} class="select select-bordered select-xs w-20">
										{#each weights as w}<option value={w}>{w || '—'}</option>{/each}
									</select>
								</td>
								<td><input type="text" bind:value={typography[sel].letterSpacing} placeholder="0" class="input input-bordered input-xs w-20" /></td>
								<td><input type="text" bind:value={typography[sel].color} placeholder="var(--x)" class="input input-bordered input-xs w-28 font-mono" /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit CSS" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
