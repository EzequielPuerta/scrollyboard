<script lang="ts">
	import { setContext } from 'svelte';
	import ScrollyRenderer from '$lib/components/preview/ScrollyRenderer.svelte';
	import { generateScopedCss, colorVarMap } from '$lib/scrolly-css';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const scopedCss = $derived(generateScopedCss(data.scrolly.css));

	const colorMap = $derived(colorVarMap(data.scrolly.css));
	setContext('scrollyColors', {
		get value() {
			return colorMap;
		}
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html `<style>${scopedCss}</style>`}

<div class="scrolly-root min-h-screen bg-base-100" data-theme={data.scrolly.theme || undefined}>
	{#each data.scrolly.components as component (component)}
		<ScrollyRenderer {component} />
	{/each}

	<div class="py-8 bg-base-200">
		<div class="container mx-auto px-4 text-center">
			<a href="/" class="btn btn-primary">Back to Gallery</a>
		</div>
	</div>
</div>
