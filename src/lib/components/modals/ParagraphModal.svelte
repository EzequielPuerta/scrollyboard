<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import VariantSelect from './VariantSelect.svelte';
	import type { ParagraphComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: ParagraphComponent;
		onClose: () => void;
		onSave: (data: ParagraphComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let content = $state(data?.content || '');
	let bg = $state(data?.bg ?? 'base-100');
	let textColor = $state(data?.textColor ?? '');

	function save() {
		onSave({ type: 'paragraph', content, bg, textColor });
	}
</script>

{#snippet contentSnippet()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<label class="label">
				<span class="label-text font-semibold">Paragraph Text</span>
			</label>
			{#if open}
				<RichTextEditor value={content} onChange={(html) => (content = html)} />
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-3">
			<VariantSelect label="Background" kind="bg" value={bg} onChange={(v) => (bg = v)} />
			<VariantSelect label="Text color" kind="text" value={textColor} onChange={(v) => (textColor = v)} />
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Paragraph" {onClose} onSave={save}>
	{@render contentSnippet()}
</BaseModal>
