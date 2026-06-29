<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import VariantSelect from './VariantSelect.svelte';
	import type { NavbarComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: NavbarComponent;
		onClose: () => void;
		onSave: (data: NavbarComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let title = $state(data?.title || 'My Navbar');
	let bg = $state(data?.bg ?? data?.bgColor ?? 'base-100');
	let textColor = $state(data?.textColor ?? '');
	let links = $state<Array<{ label: string; href: string }>>(data?.links || [{ label: 'Home', href: '/' }]);

	function addLink() {
		links.push({ label: 'New Link', href: '#' });
		links = links;
	}

	function removeLink(idx: number) {
		links.splice(idx, 1);
		links = links;
	}

	function save() {
		onSave({ type: 'navbar', title, links, bg, textColor });
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<label class="label">
				<span class="label-text font-semibold">Navbar Title</span>
			</label>
			<input type="text" bind:value={title} class="input input-bordered w-full" />
		</div>

		<div class="grid grid-cols-2 gap-3">
			<VariantSelect label="Background" kind="bg" value={bg} onChange={(v) => (bg = v)} />
			<VariantSelect label="Text color" kind="text" value={textColor} onChange={(v) => (textColor = v)} />
		</div>

		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="label">
					<span class="label-text font-semibold">Links</span>
				</label>
				<button type="button" onclick={addLink} class="btn btn-xs btn-primary">+ Add Link</button>
			</div>

			<div class="space-y-2">
				{#each links as link, idx}
					<div class="flex gap-2">
						<input type="text" bind:value={link.label} placeholder="Label" class="input input-bordered input-sm flex-1" />
						<input type="text" bind:value={link.href} placeholder="URL" class="input input-bordered input-sm flex-1" />
						<button type="button" onclick={() => removeLink(idx)} class="btn btn-xs btn-ghost text-error">✕</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Navbar" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
