<script lang="ts">
	import type { EditorStore } from '$lib/stores/editor.svelte';
	import ScrollyRenderer from '$lib/components/preview/ScrollyRenderer.svelte';
	import { generateScopedCss } from '$lib/scrolly-css';

	interface Props {
		editor: EditorStore;
		rootEl?: HTMLElement;
	}

	let { editor, rootEl = $bindable() }: Props = $props();
	const scopedCss = $derived(generateScopedCss(editor.scrolly?.css));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html `<style>${scopedCss}</style>`}

<div
	bind:this={rootEl}
	data-theme={editor.scrolly?.theme || undefined}
	class="scrolly-root flex-1 bg-base-100 overflow-y-auto relative"
>
	{#if editor.isSaving}
		<div class="absolute top-4 right-4 badge badge-info gap-2">
			<span class="loading loading-spinner loading-xs"></span>
			Saving...
		</div>
	{/if}

	{#if editor.scrolly?.components}
		{#each editor.scrolly.components as component (component)}
			<ScrollyRenderer {component} />
		{/each}
	{:else}
		<div class="flex items-center justify-center h-full">
			<p class="text-base-content/50">Preview will appear here</p>
		</div>
	{/if}
</div>
