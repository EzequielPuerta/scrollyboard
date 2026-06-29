<script lang="ts">
	import type { ScrollyDoc } from '$lib/types/scrolly';

	interface Props {
		scrolly: ScrollyDoc;
		onDelete: (scrolly: ScrollyDoc) => void;
	}

	const { scrolly, onDelete }: Props = $props();

	function truncate(text: string, length: number) {
		return text.length > length ? text.substring(0, length) + '...' : text;
	}

	// Inline lucide icon paths (stroke-based, 24x24 viewBox) for layouts
	const layoutIcons: Record<string, { label: string; path: string }> = {
		overlay: {
			label: 'Overlay',
			path: '<rect width="12" height="12" x="3" y="3" rx="2"/><rect width="12" height="12" x="9" y="9" rx="2"/>'
		},
		'side-by-side': {
			label: 'Side-by-Side',
			path: '<rect width="8" height="18" x="3" y="3" rx="1"/><rect width="8" height="18" x="13" y="3" rx="1"/><path d="M11 3v18"/>'
		},
		slide: {
			label: 'Slide',
			path: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 10h18"/>'
		}
	};

	function formatDate(date: string | Date): string {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	const isNew = $derived(
		scrolly.createdAt ? new Date(scrolly.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 : false
	);
	const layoutTypes = $derived.by(() => {
		const types = new Set(scrolly.components.map((c) => (c.type === 'scene' ? (c as any).layout : null)).filter(Boolean));
		return types;
	});
</script>

<div class="card bg-base-100 shadow-sm">
	<figure class="bg-gradient-to-br from-primary to-secondary h-48 relative overflow-hidden">
		{#if scrolly.thumbnail}
			<img src={scrolly.thumbnail} alt={scrolly.title} class="w-full h-full object-cover" />
		{:else}
			<div class="flex items-center justify-center w-full h-full text-white text-opacity-20">
				<svg class="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
					<path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
				</svg>
			</div>
		{/if}
		{#if isNew}
			<div class="badge badge-secondary absolute top-2 right-2">NEW</div>
		{/if}
		<button
			type="button"
			onclick={() => onDelete(scrolly)}
			class="btn btn-xs btn-circle btn-error absolute top-2 left-2 opacity-80 hover:opacity-100"
			title="Delete scrolly"
			aria-label="Delete scrolly"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M3 6h18" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" x2="10" y1="11" y2="17" />
				<line x1="14" x2="14" y1="11" y2="17" />
			</svg>
		</button>
	</figure>

	<div class="card-body">
		<div class="flex items-start justify-between gap-2">
			<h2 class="card-title text-lg flex-1">
				{truncate(scrolly.title, 40)}
			</h2>
			{#if scrolly.createdAt}
				<div class="badge badge-ghost text-xs whitespace-nowrap">
					{formatDate(scrolly.createdAt)}
				</div>
			{/if}
		</div>
		<p class="text-sm text-base-content/70">
			{truncate(scrolly.description, 80)}
		</p>

		<div class="card-actions justify-between items-center mt-4">
			<div class="flex gap-1 flex-wrap">
				{#each Array.from(layoutTypes) as layout}
					<div class="badge badge-outline text-xs flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html layoutIcons[layout].path}
						</svg>
						<span>{layoutIcons[layout].label}</span>
					</div>
				{/each}
			</div>
			<div class="join">
				<a href={`/${scrolly.slug || scrolly._id}`} class="btn btn-sm btn-ghost">View</a>
				<a href={`/editor/${scrolly._id}`} class="btn btn-sm btn-primary">Edit</a>
			</div>
		</div>
	</div>
</div>
