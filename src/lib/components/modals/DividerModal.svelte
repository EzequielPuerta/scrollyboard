<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import VariantSelect from './VariantSelect.svelte';
	import type { DividerComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: DividerComponent;
		onClose: () => void;
		onSave: (data: DividerComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let text = $state(data?.text || 'Section Title');
	let level = $state<1 | 2 | 3 | 4>(data?.level || 2);
	let bg = $state(data?.bg ?? 'base-100');
	let textColor = $state(data?.textColor ?? data?.color ?? '');

	function save() {
		onSave({ type: 'divider', text, level, bg, textColor });
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<label class="label">
				<span class="label-text font-semibold">Title Text</span>
			</label>
			<input type="text" bind:value={text} class="input input-bordered w-full" />
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">Heading Level</span>
			</label>
			<select bind:value={level} class="select select-bordered w-full">
				<option value={1}>H1 (Largest)</option>
				<option value={2}>H2</option>
				<option value={3}>H3</option>
				<option value={4}>H4 (Smallest)</option>
			</select>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<VariantSelect label="Background" kind="bg" value={bg} onChange={(v) => (bg = v)} />
			<VariantSelect label="Text color" kind="text" value={textColor} onChange={(v) => (textColor = v)} />
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Divider" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
