<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import type { ImageComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: ImageComponent;
		onClose: () => void;
		onSave: (data: ImageComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let src = $state(data?.src || '');
	let alt = $state(data?.alt || 'Image');
	let caption = $state(data?.caption || '');

	function save() {
		onSave({ type: 'image', src, alt, caption: caption || undefined });
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<label class="label">
				<span class="label-text font-semibold">Image URL *</span>
			</label>
			<input type="url" bind:value={src} class="input input-bordered w-full" placeholder="https://..." />
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">Alt Text (for accessibility)</span>
			</label>
			<input type="text" bind:value={alt} class="input input-bordered w-full" placeholder="Description of image" />
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">Caption (optional)</span>
			</label>
			<input type="text" bind:value={caption} class="input input-bordered w-full" placeholder="Image caption" />
		</div>

		{#if src}
			<div class="border border-base-300 rounded-lg p-4">
				<p class="text-sm text-base-content/70 mb-2">Preview:</p>
				<img src={src} alt={alt} class="w-full max-h-48 object-cover rounded" />
			</div>
		{/if}
	</div>
{/snippet}

<BaseModal {open} title="Edit Image" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
