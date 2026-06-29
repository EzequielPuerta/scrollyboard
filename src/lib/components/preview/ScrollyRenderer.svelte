<script lang="ts">
	import type { ScrollyComponent } from '$lib/types/scrolly';
	import NavbarPreview from './NavbarPreview.svelte';
	import HeroPreview from './HeroPreview.svelte';
	import FooterPreview from './FooterPreview.svelte';
	import DividerPreview from './DividerPreview.svelte';
	import ParagraphPreview from './ParagraphPreview.svelte';
	import ImagePreview from './ImagePreview.svelte';
	import ScenePreview from './ScenePreview.svelte';
	import ChartPreview from './ChartPreview.svelte';

	interface Props {
		component: ScrollyComponent;
	}

	const { component }: Props = $props();
</script>

{#if component.type === 'navbar'}
	<NavbarPreview data={component} />
{:else if component.type === 'hero'}
	<HeroPreview data={component} />
{:else if component.type === 'footer'}
	<FooterPreview data={component} />
{:else if component.type === 'divider'}
	<DividerPreview data={component} />
{:else if component.type === 'paragraph'}
	<ParagraphPreview data={component} />
{:else if component.type === 'image'}
	<ImagePreview data={component} />
{:else if component.type === 'scene'}
	<ScenePreview data={component} />
{:else if component.type === 'chart'}
	<div class="py-8 bg-base-100">
		<div class="container mx-auto px-4 flex justify-center">
			<ChartPreview config={component} />
		</div>
	</div>
{/if}
