<script lang="ts">
	import type { FooterComponent } from '$lib/types/scrolly';
	import { resolveBg, resolveText } from '$lib/variants';

	interface Props {
		data: FooterComponent;
	}

	const { data }: Props = $props();

	const bgVar = $derived(data.bg ?? data.bgColor);
	const bg = $derived(resolveBg(bgVar, 'base-200'));
	const text = $derived(resolveText(data.textColor, bgVar, 'base-200'));
	const colClass: Record<number, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4'
	};
	const cols = $derived(colClass[Math.max(1, Math.min(data.columns.length, 4))]);
</script>

<footer class={`footer ${bg} ${text} p-10`}>
	<div class={`grid gap-8 w-full max-w-full ${cols}`}>
		{#each data.columns as col}
			<div>
				<span class="footer-title text-lg font-bold">{col.heading}</span>
				<p>{col.text}</p>
			</div>
		{/each}
	</div>
</footer>
