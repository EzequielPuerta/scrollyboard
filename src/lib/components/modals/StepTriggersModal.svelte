<script lang="ts">
	import ChangeEditor from './ChangeEditor.svelte';
	import type { StepConfig, StepTrigger, StepChange, StepEventType } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		step: StepConfig | null;
		chartType: string;
		onClose: () => void;
	}

	let { open, step, chartType, onClose }: Props = $props();

	const EVENTS: StepEventType[] = ['onEnter', 'onComplete', 'onExit', 'onInactive', 'onReturn'];
	const rid = () => Math.random().toString(36).slice(2, 9);

	function addTrigger() {
		if (!step) return;
		step.triggers = [...(step.triggers ?? []), { id: rid(), event: 'onEnter', changes: [] }];
	}
	function removeTrigger(i: number) {
		step?.triggers?.splice(i, 1);
	}
	function addChange(t: StepTrigger, target: 'segments' | 'markers') {
		const ch: StepChange =
			target === 'segments'
				? { target: 'segments', mode: 'set', segments: {} }
				: { target: 'markers', mode: 'add', markers: [] };
		t.changes = [...t.changes, ch];
	}
	function removeChange(t: StepTrigger, j: number) {
		t.changes.splice(j, 1);
	}
</script>

<dialog class="modal modal-stack" class:modal-open={open}>
	<div class="modal-box max-w-3xl">
		<h3 class="font-bold text-lg">Step triggers</h3>
		<p class="text-xs text-base-content/60 mb-3 truncate">“{step?.text}”</p>
		<p class="text-xs text-base-content/50 mb-3">
			Run changes to the scene chart when this step reaches a lifecycle event.
		</p>

		{#if step}
			<div class="flex flex-col gap-3">
				{#each step.triggers ?? [] as t, i (t.id)}
					<div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<span class="text-xs font-semibold">When</span>
							<select bind:value={t.event} class="select select-bordered select-sm">
								{#each EVENTS as e}<option value={e}>{e}</option>{/each}
							</select>
							<button type="button" onclick={() => removeTrigger(i)} class="btn btn-xs btn-ghost text-error ml-auto">✕</button>
						</div>

						{#each t.changes as ch, j (j)}
							<div class="bg-base-200 rounded p-2 flex flex-col gap-2">
								<div class="flex gap-2 items-center">
									<span class="badge badge-sm">{ch.target}</span>
									<select bind:value={ch.mode} class="select select-bordered select-xs">
										{#if ch.target === 'segments'}
											<option value="set">set (replace)</option>
											<option value="merge">merge with base</option>
										{:else}
											<option value="set">set (replace)</option>
											<option value="add">add to base</option>
										{/if}
									</select>
									<button type="button" onclick={() => removeChange(t, j)} class="btn btn-xs btn-ghost text-error ml-auto">remove</button>
								</div>
								<ChangeEditor change={ch} {chartType} />
							</div>
						{/each}

						<div class="flex gap-1">
							<button type="button" onclick={() => addChange(t, 'segments')} class="btn btn-xs btn-ghost">+ Segments change</button>
							<button type="button" onclick={() => addChange(t, 'markers')} class="btn btn-xs btn-ghost">+ Markers change</button>
						</div>
					</div>
				{/each}

				<button type="button" onclick={addTrigger} class="btn btn-sm btn-primary self-start">+ Trigger</button>
			</div>
		{/if}

		<div class="modal-action">
			<button type="button" onclick={onClose} class="btn btn-sm btn-primary">Done</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop" onclick={onClose}>
		<button type="button">close</button>
	</form>
</dialog>

<style>
	/* Sit above the parent scene modal. */
	.modal-stack.modal-open {
		display: grid;
		place-items: center;
		z-index: 1100;
	}
</style>
