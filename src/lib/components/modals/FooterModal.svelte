<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import VariantSelect from './VariantSelect.svelte';
	import type { FooterComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: FooterComponent;
		onClose: () => void;
		onSave: (data: FooterComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let bg = $state(data?.bg ?? data?.bgColor ?? 'base-200');
	let textColor = $state(data?.textColor ?? '');
	let columns = $state<Array<{ heading: string; text: string }>>(
		data?.columns || [{ heading: 'Column 1', text: 'Footer text' }]
	);

	function addColumn() {
		columns.push({ heading: 'New Column', text: 'Add text' });
		columns = columns;
	}

	function removeColumn(idx: number) {
		columns.splice(idx, 1);
		columns = columns;
	}

	function save() {
		onSave({ type: 'footer', columns, bg, textColor });
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div class="grid grid-cols-2 gap-3">
			<VariantSelect label="Background" kind="bg" value={bg} onChange={(v) => (bg = v)} />
			<VariantSelect label="Text color" kind="text" value={textColor} onChange={(v) => (textColor = v)} />
		</div>

		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="label">
					<span class="label-text font-semibold">Columns ({columns.length})</span>
				</label>
				<button type="button" onclick={addColumn} class="btn btn-xs btn-primary">+ Add Column</button>
			</div>

			<div class="space-y-3">
				{#each columns as col, idx}
					<div class="border border-base-300 p-3 rounded-lg">
						<input type="text" bind:value={col.heading} placeholder="Column heading" class="input input-bordered input-sm w-full mb-2" />
						<textarea bind:value={col.text} placeholder="Column text" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
						<button type="button" onclick={() => removeColumn(idx)} class="btn btn-xs btn-ghost text-error mt-2">
							Delete Column
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Footer" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
