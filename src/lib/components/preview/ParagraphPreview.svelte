<script lang="ts">
	import type { ParagraphComponent } from '$lib/types/scrolly';
	import { resolveBg, resolveText } from '$lib/variants';

	interface Props {
		data: ParagraphComponent;
	}

	const { data }: Props = $props();

	const bg = $derived(resolveBg(data.bg, 'base-100'));
	const text = $derived(resolveText(data.textColor, data.bg, 'base-100'));
</script>

<div class={`py-8 ${bg}`}>
	<div class="container mx-auto px-4 max-w-3xl">
		<div class={`prose-sm max-w-none text-base leading-relaxed ${text}`}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</div>
</div>
