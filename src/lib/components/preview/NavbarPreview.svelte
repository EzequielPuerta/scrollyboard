<script lang="ts">
	import type { NavbarComponent } from '$lib/types/scrolly';
	import { resolveBg, resolveText } from '$lib/variants';

	interface Props {
		data: NavbarComponent;
	}

	const { data }: Props = $props();

	const bgVar = $derived(data.bg ?? data.bgColor);
	const bg = $derived(resolveBg(bgVar, 'base-100'));
	const text = $derived(resolveText(data.textColor, bgVar, 'base-100'));
</script>

<div class={`navbar ${bg} ${text} shadow-sm`}>
	<div class="flex-1">
		<h1 class="text-xl font-bold">{data.title}</h1>
	</div>
	<div class="gap-2">
		{#each data.links as link}
			<a href={link.href} class="btn btn-ghost btn-sm">{link.label}</a>
		{/each}
	</div>
</div>
