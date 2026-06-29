<script lang="ts">
	import { Scrolly, Layer, Step, Overlay, SideBySide, Slide } from '@fundar/data-scrolly-telling';
	import ChartPreview from './ChartPreview.svelte';
	import type { SceneComponent } from '$lib/types/scrolly';
	import { writable } from 'svelte/store';

	interface Props {
		data: SceneComponent;
	}

	const { data }: Props = $props();

	const threshold = writable({ type: 'percentage', value: 50 } as any);

	// Step triggers override the chart's segments/markers as steps are reached.
	let override = $state<{ segments?: any; markers?: any }>({});

	const chartData = $derived.by(() => {
		if (data.data.kind !== 'chart') return data.data;
		return {
			...data.data,
			...(override.segments !== undefined ? { segments: override.segments } : {}),
			...(override.markers !== undefined ? { markers: override.markers } : {})
		};
	});

	function applyTriggers(step: (typeof data.steps)[number], event: string) {
		if (data.data.kind !== 'chart') return;
		const trigs = (step.triggers ?? []).filter((t) => t.event === event);
		if (!trigs.length) return;
		const base = data.data;
		let seg = override.segments;
		let mark = override.markers;
		for (const t of trigs) {
			for (const ch of t.changes) {
				if (ch.target === 'segments') {
					seg = ch.mode === 'merge' ? { ...(base.segments ?? {}), ...(ch.segments ?? {}) } : ch.segments;
				} else {
					mark = ch.mode === 'add' ? [...(base.markers ?? []), ...(ch.markers ?? [])] : ch.markers;
				}
			}
		}
		override = { segments: seg, markers: mark };
	}

	const layout = $derived.by(() => {
		switch (data.layout) {
			case 'overlay':
				return Overlay;
			case 'side-by-side':
				return SideBySide;
			case 'slide':
				return Slide;
			default:
				return null;
		}
	});
</script>

<div class="min-h-96" class:slide-scene={data.layout === 'slide'}>
	{#snippet dataSnippet()}
		<Layer fill>
			{#if data.data.kind === 'text'}
				<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10">
					<p class="text-center px-8 text-lg">{(data.data as any).content}</p>
				</div>
			{:else if data.data.kind === 'image'}
				{#if (data.data as any).src}
					<img src={(data.data as any).src} alt={(data.data as any).alt} class="w-full h-full object-cover" />
				{:else}
					<div class="flex items-center justify-center w-full h-full bg-base-200">
						<p class="text-base-content/50">Image not configured</p>
					</div>
				{/if}
			{:else if data.data.kind === 'chart'}
				<div class="chart-host flex items-center justify-center w-full h-full overflow-auto p-4">
					<ChartPreview config={chartData as any} />
				</div>
			{/if}
		</Layer>
	{/snippet}

	{#snippet tellingSnippet()}
		{#each data.steps as step}
			<Step
				threshold={$threshold}
				onEnter={() => applyTriggers(step, 'onEnter')}
				onComplete={() => applyTriggers(step, 'onComplete')}
				onExit={() => applyTriggers(step, 'onExit')}
				onInactive={() => applyTriggers(step, 'onInactive')}
				onReturn={() => applyTriggers(step, 'onReturn')}
			>
				<p class="prose max-w-md">{step.text}</p>
			</Step>
		{/each}
	{/snippet}

	{#if layout}
		<Scrolly {layout} layoutProps={data.layoutProps as any} data={dataSnippet} telling={tellingSnippet} cssClass="scene-preview" />
	{/if}
</div>

<style>
	/* Slide layout hardcodes a 100dvh sticky "telling" stage; if the scene's
	   total height (steps × dvhHeightPerStep) is shorter, that stage overflows
	   into the next component. Guaranteeing the scrolly is at least 100dvh tall
	   keeps the stage contained. */
	.slide-scene :global(.scrolly) {
		min-height: 100dvh;
	}

	/* The chart keeps its configured size but never overflows the scene: it
	   scales down to the available width (centered) and grows up to it. */
	.chart-host :global(svg) {
		max-width: 100%;
		max-height: 100%;
		height: auto;
	}

	:global(.scene-preview [data-telling-step]) {
		--step-padding: 2rem;
		--step-background-color: var(--color-base-100);
		--step-color: var(--color-content-primary);
		--step-border-radius: 8px;
		--step-max-width: 600px;
		--step-margin-y: 50vh;
		--step-margin-x: auto;
	}
</style>
