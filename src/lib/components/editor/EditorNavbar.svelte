<script lang="ts">
	import { goto } from '$app/navigation';
	import type { EditorStore } from '$lib/stores/editor.svelte';
	import { DAISY_THEMES, slugify } from '$lib/themes';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import CssModal from '$lib/components/modals/CssModal.svelte';

	interface Props {
		editor: EditorStore;
	}

	const { editor }: Props = $props();

	const publicPath = $derived(`/${editor.scrolly?.slug || editor.scrolly?._id || ''}`);

	let confirmDelete = $state(false);
	let cssOpen = $state(false);

	// Auto-derive the slug from the title until the user edits the slug by hand.
	// Starts active only when the scrolly has no slug yet ("si ya hay uno, no").
	let slugAuto = $state(true);
	let lastId: string | undefined;
	$effect(() => {
		const id = editor.scrolly?._id ? String(editor.scrolly._id) : undefined;
		if (id && id !== lastId) {
			lastId = id;
			slugAuto = !editor.scrolly!.slug;
		}
	});

	function onTitleInput(value: string) {
		editor.updateMeta({ title: value });
		if (slugAuto) editor.updateMeta({ slug: slugify(value) });
	}

	function onSlugInput(value: string) {
		const slug = slugify(value);
		// Clearing the slug re-enables auto-tracking; any value pins it.
		slugAuto = slug === '';
		editor.updateMeta({ slug });
	}

	async function doDelete() {
		confirmDelete = false;
		if (!editor.scrolly?._id) return;
		await fetch(`/api/scrollies/${editor.scrolly._id}`, { method: 'DELETE' });
		goto('/');
	}
</script>

<div class="navbar bg-base-300 shadow-sm min-h-0 py-2 px-3 gap-2">
	<a href="/" class="btn btn-ghost btn-sm btn-square" title="Back to home" aria-label="Back to home">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m12 19-7-7 7-7" />
			<path d="M19 12H5" />
		</svg>
	</a>

	<div class="flex-1 flex flex-col gap-0.5 min-w-0">
		<input
			class="input input-ghost input-sm font-bold text-base px-1 w-full max-w-md"
			placeholder="Untitled Scrolly"
			value={editor.scrolly?.title ?? ''}
			oninput={(e) => onTitleInput(e.currentTarget.value)}
		/>
		<input
			class="input input-ghost input-xs text-base-content/60 px-1 w-full max-w-md"
			placeholder="Add a description..."
			value={editor.scrolly?.description ?? ''}
			oninput={(e) => editor.updateMeta({ description: e.currentTarget.value })}
		/>
	</div>

	<div class="flex items-center gap-2">
		{#if editor.isSaving}
			<span class="text-xs text-base-content/60 flex items-center gap-1">
				<span class="loading loading-spinner loading-xs"></span> Saving
			</span>
		{:else if editor.isDirty}
			<span class="text-xs text-base-content/40">● Unsaved changes</span>
		{:else}
			<span class="text-xs text-success/70">✓ All saved</span>
		{/if}

		{#if editor.scrolly}
			<a href={publicPath} target="_blank" class="btn btn-sm btn-primary">View</a>

			<!-- Everything else lives in one menu -->
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost btn-sm btn-square" title="Menu" aria-label="Menu">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="5" r="1" />
						<circle cx="12" cy="12" r="1" />
						<circle cx="12" cy="19" r="1" />
					</svg>
				</button>
				<div
					tabindex="-1"
					role="menu"
					class="dropdown-content z-[60] mt-2 w-72 rounded-box bg-base-100 p-4 shadow-lg border border-base-200 flex flex-col gap-3"
				>
					<div>
						<span class="label-text font-semibold text-sm">Theme</span>
						<p class="text-xs text-base-content/50 mb-1">Applied to this scrolly only.</p>
						<select
							class="select select-bordered select-sm w-full"
							value={editor.scrolly?.theme ?? ''}
							onchange={(e) => editor.updateMeta({ theme: e.currentTarget.value })}
						>
							<option value="">Default (inherit)</option>
							{#each DAISY_THEMES as t (t)}
								<option value={t}>{t}</option>
							{/each}
						</select>
					</div>

					<div>
						<span class="label-text font-semibold text-sm">Custom slug</span>
						<p class="text-xs text-base-content/50 mb-1">Leave empty to use the ID.</p>
						<input
							class="input input-bordered input-sm w-full"
							placeholder={String(editor.scrolly?._id ?? '')}
							value={editor.scrolly?.slug ?? ''}
							oninput={(e) => onSlugInput(e.currentTarget.value)}
						/>
						<p class="text-xs text-base-content/60 mt-1 truncate">
							URL: <span class="font-mono">{publicPath}</span>
						</p>
					</div>

					<div class="divider my-0"></div>

					<button type="button" onclick={() => (cssOpen = true)} class="btn btn-ghost btn-sm justify-start gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m18 16 4-4-4-4" />
							<path d="m6 8-4 4 4 4" />
							<path d="m14.5 4-5 16" />
						</svg>
						Edit CSS
					</button>

					<a href={`/api/scrollies/${editor.scrolly._id}/export`} class="btn btn-ghost btn-sm justify-start gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<path d="M7 10l5 5 5-5" />
							<path d="M12 15V3" />
						</svg>
						Download as .svelte
					</a>

					<button type="button" onclick={() => (confirmDelete = true)} class="btn btn-ghost btn-sm justify-start gap-2 text-error">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 6h18" />
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
							<line x1="10" x2="10" y1="11" y2="17" />
							<line x1="14" x2="14" y1="11" y2="17" />
						</svg>
						Delete scrolly
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<ConfirmModal
	open={confirmDelete}
	title="Delete scrolly?"
	message={`"${editor.scrolly?.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
	confirmLabel="Delete"
	onConfirm={doDelete}
	onCancel={() => (confirmDelete = false)}
/>

{#if cssOpen}
	<CssModal
		open={cssOpen}
		data={editor.scrolly?.css}
		onClose={() => (cssOpen = false)}
		onSave={(css) => {
			editor.updateMeta({ css });
			cssOpen = false;
		}}
	/>
{/if}
