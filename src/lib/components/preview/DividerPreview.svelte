<script lang="ts">
	import type { DividerComponent } from '$lib/types/scrolly';
	import { resolveBg, resolveText } from '$lib/variants';

	interface Props {
		data: DividerComponent;
	}

	const { data }: Props = $props();

	const bg = $derived(resolveBg(data.bg, 'base-100'));
	const text = $derived(resolveText(data.textColor ?? data.color, data.bg, 'base-100'));
	const heading = $derived(`font-bold ${text}`);
</script>

<div class={`py-12 ${bg}`}>
	<div class="container mx-auto px-4 text-center">
		{#if data.level === 1}
			<h1 class={heading}>{data.text}</h1>
		{:else if data.level === 2}
			<h2 class={heading}>{data.text}</h2>
		{:else if data.level === 3}
			<h3 class={heading}>{data.text}</h3>
		{:else}
			<h4 class={heading}>{data.text}</h4>
		{/if}
	</div>
</div>
