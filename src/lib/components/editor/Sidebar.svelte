<script lang="ts">
	import type { EditorStore } from '$lib/stores/editor.svelte';
	import type { ComponentType } from '$lib/types/scrolly';

	interface Props {
		editor: EditorStore;
	}

	const { editor }: Props = $props();

	// Inline lucide icon paths (stroke-based, 24x24 viewBox).
	const componentTypes: Array<{ type: ComponentType; label: string; path: string }> = [
		{
			type: 'navbar',
			label: 'Navbar',
			path: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>'
		},
		{
			type: 'hero',
			label: 'Hero',
			path: '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>'
		},
		{
			type: 'footer',
			label: 'Footer',
			path: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 15h18"/>'
		},
		{
			type: 'divider',
			label: 'Divider',
			// Arrows collapsing toward a center line (Bootstrap arrows-collapse, stroke style).
			path: '<path d="M4 12h16"/><path d="M12 3v6"/><path d="m9 6 3 3 3-3"/><path d="M12 21v-6"/><path d="m9 18 3-3 3 3"/>'
		},
		{
			type: 'paragraph',
			label: 'Paragraph',
			path: '<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>'
		},
		{
			type: 'image',
			label: 'Image',
			path: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'
		},
		{
			type: 'scene',
			label: 'Scene',
			path: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>'
		},
		{
			type: 'chart',
			label: 'Chart',
			path: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'
		}
	];
</script>

<div class="w-16 bg-base-300 shadow-sm flex flex-col items-center py-4 gap-1">
	{#each componentTypes as comp (comp)}
		<button
			onclick={() => editor.addComponent(comp.type)}
			title={comp.label}
			class="btn btn-ghost btn-square text-base-content/70 hover:text-primary"
			aria-label={comp.label}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html comp.path}
			</svg>
		</button>
	{/each}
</div>
