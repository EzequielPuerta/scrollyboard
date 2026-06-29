<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import ChartConfigForm from './chart/ChartConfigForm.svelte';
	import StepTriggersModal from './StepTriggersModal.svelte';
	import { emptyChartConfig, type ChartConfig } from '$lib/chart-config';
	import type { SceneComponent, SceneData, StepConfig } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: SceneComponent;
		onClose: () => void;
		onSave: (data: SceneComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let layout = $state<'overlay' | 'side-by-side' | 'slide'>(data?.layout || 'overlay');
	let gridColumns = $state((data?.layoutProps as any)?.gridColumns || '1fr 3fr');
	let inverted = $state((data?.layoutProps as any)?.inverted || false);
	let dvhHeightPerStep = $state((data?.layoutProps as any)?.dvhHeightPerStep || 100);
	let sceneDataKind = $state<'text' | 'image' | 'chart'>(data?.data.kind || 'text');
	let textContent = $state((data?.data as any)?.content || '');
	let imageUrl = $state((data?.data as any)?.src || '');
	let imageAlt = $state((data?.data as any)?.alt || 'Scene image');

	function initChartConfig(): ChartConfig {
		if (data?.data?.kind === 'chart') {
			const rest = { ...structuredClone($state.snapshot(data.data)) } as Record<string, unknown>;
			delete rest.kind;
			return { ...emptyChartConfig(), ...(rest as Partial<ChartConfig>) };
		}
		return emptyChartConfig();
	}
	let chartConfig = $state<ChartConfig>(initChartConfig());

	const sceneTabs = `scene-tabs-${Math.random().toString(36).slice(2)}`;

	let triggerStep = $state<StepConfig | null>(null);
	let steps = $state<StepConfig[]>(data?.steps || [{ id: Math.random().toString(36).substring(2, 11), text: 'Step 1' }]);

	function addStep() {
		steps.push({
			id: Math.random().toString(36).substring(2, 11),
			text: `Step ${steps.length + 1}`,
			showData: false
		});
		steps = steps;
	}

	function removeStep(idx: number) {
		if (steps.length > 1) {
			steps.splice(idx, 1);
			steps = steps;
		}
	}

	function save() {
		let sceneData: SceneData;

		if (sceneDataKind === 'text') {
			sceneData = { kind: 'text', content: textContent };
		} else if (sceneDataKind === 'image') {
			sceneData = { kind: 'image', src: imageUrl, alt: imageAlt };
		} else {
			sceneData = { kind: 'chart', ...($state.snapshot(chartConfig) as ChartConfig) };
		}

		const layoutProps: Record<string, unknown> = {
			offsetTop: '0px',
			offsetBottom: '0px'
		};

		if (layout === 'side-by-side') {
			layoutProps.gridColumns = gridColumns;
			layoutProps.inverted = inverted;
		}

		if (layout === 'slide') {
			layoutProps.dvhHeightPerStep = dvhHeightPerStep;
		}

		onSave({
			type: 'scene',
			layout,
			layoutProps,
			data: sceneData,
			steps
		});
	}
</script>

{#snippet content()}
	<div class="tabs tabs-lift">
		<input type="radio" name={sceneTabs} class="tab" aria-label="Layout" checked />
		<div class="tab-content border-base-300 bg-base-100 p-4">
			<div class="space-y-6">

		<div>
			<label class="label">
				<span class="label-text font-semibold">Layout Type</span>
			</label>
			<select bind:value={layout} class="select select-bordered w-full">
				<option value="overlay">Overlay (data fixed, text scrolls)</option>
				<option value="side-by-side">Side-by-Side (two columns)</option>
				<option value="slide">Slide (full-screen slides)</option>
			</select>
		</div>

		{#if layout === 'side-by-side'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="label">
						<span class="label-text font-semibold">Grid Columns</span>
					</label>
					<input type="text" bind:value={gridColumns} class="input input-bordered w-full text-sm" placeholder="1fr 3fr" />
				</div>
				<label class="label cursor-pointer">
					<input type="checkbox" bind:checked={inverted} class="checkbox" />
					<span class="label-text ml-2">Invert (data on right)</span>
				</label>
			</div>
		{/if}

		{#if layout === 'slide'}
			<div>
				<label class="label">
					<span class="label-text font-semibold">Viewport Height per Step</span>
				</label>
				<input type="number" bind:value={dvhHeightPerStep} min="50" max="200" class="input input-bordered w-full" />
			</div>
		{/if}

			</div>
		</div>

		<input type="radio" name={sceneTabs} class="tab" aria-label="Data" />
		<div class="tab-content border-base-300 bg-base-100 p-4">
			<div class="space-y-6">

				<div class="space-y-2">
					<label class="label">
						<span class="label-text font-semibold">Data Type</span>
					</label>
			<div class="join w-full">
				<input
					type="radio"
					name="data-type"
					value="text"
					bind:group={sceneDataKind}
					aria-label="Text"
					class="join-item btn btn-sm"
				/>
				<input
					type="radio"
					name="data-type"
					value="image"
					bind:group={sceneDataKind}
					aria-label="Image"
					class="join-item btn btn-sm"
				/>
				<input
					type="radio"
					name="data-type"
					value="chart"
					bind:group={sceneDataKind}
					aria-label="Chart"
					class="join-item btn btn-sm"
				/>
			</div>
		</div>

		{#if sceneDataKind === 'text'}
			<div>
				<label class="label">
					<span class="label-text font-semibold">Text Content</span>
				</label>
				<textarea bind:value={textContent} class="textarea textarea-bordered w-full" rows="3" placeholder="Scene text..."></textarea>
			</div>
		{:else if sceneDataKind === 'image'}
			<div class="space-y-2">
				<label class="label">
					<span class="label-text font-semibold">Image URL</span>
				</label>
				<input type="url" bind:value={imageUrl} class="input input-bordered w-full" placeholder="https://..." />
				<label class="label">
					<span class="label-text font-semibold">Alt Text</span>
				</label>
				<input type="text" bind:value={imageAlt} class="input input-bordered w-full" />
			</div>
				{:else}
					<ChartConfigForm config={chartConfig} />
				{/if}
			</div>
		</div>

		<input type="radio" name={sceneTabs} class="tab" aria-label="Narrative" />
		<div class="tab-content border-base-300 bg-base-100 p-4">
			<div class="space-y-6">

				<div class="space-y-3">
			{#each steps as step, idx (step.id)}
				<div class="border border-base-300 p-3 rounded-lg">
					<input type="text" bind:value={step.text} placeholder="Step text" class="input input-bordered input-sm w-full mb-2" />
					<div class="flex gap-2">
						<select bind:value={step.showData} class="select select-bordered select-sm flex-1">
							<option value={false}>No data</option>
							<option value={true}>Show data</option>
							<option value="force-refresh">Force refresh</option>
						</select>
						{#if sceneDataKind === 'chart'}
							<button type="button" onclick={() => (triggerStep = step)} class="btn btn-sm btn-ghost gap-1" title="Step triggers">
								⚡ Triggers{step.triggers?.length ? ` (${step.triggers.length})` : ''}
							</button>
						{/if}
						{#if steps.length > 1}
							<button
								type="button"
								onclick={() => removeStep(idx)}
								class="btn btn-xs btn-ghost btn-square text-error"
								title="Delete step"
								aria-label="Delete step"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M3 6h18" />
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
									<line x1="10" x2="10" y1="11" y2="17" />
									<line x1="14" x2="14" y1="11" y2="17" />
								</svg>
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>

				<button type="button" onclick={addStep} class="btn btn-sm btn-primary w-full">+ Add Step</button>
			</div>
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Scene" {onClose} onSave={save}>
	{@render content()}
</BaseModal>

{#if triggerStep}
	<StepTriggersModal
		open={triggerStep !== null}
		step={triggerStep}
		chartType={chartConfig.chartType}
		onClose={() => (triggerStep = null)}
	/>
{/if}
