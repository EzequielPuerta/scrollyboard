<script lang="ts">
	import type { HeroComponent } from '$lib/types/scrolly';
	import { resolveBg, resolveText } from '$lib/variants';

	interface Props {
		data: HeroComponent;
	}

	const { data }: Props = $props();

	// A custom gradient or image overrides the variant background.
	const useCustomBg = $derived(Boolean(data.gradient || data.bgImage));
	const bgClass = $derived(useCustomBg ? '' : resolveBg(data.bg, 'primary'));
	const text = $derived(resolveText(data.textColor, useCustomBg ? undefined : (data.bg ?? 'primary'), 'primary'));

	// Inline min-height (when set) overrides the default min-h-80 class.
	const style = $derived(
		`${data.gradient ? `background: ${data.gradient};` : ''}${data.height ? `min-height: ${data.height};` : ''}`
	);
</script>

<div class={`hero relative overflow-hidden min-h-80 ${bgClass} ${text}`} {style}>
	{#if data.bgImage && !data.gradient}
		<img src={data.bgImage} alt="hero background" class="absolute inset-0 w-full h-full object-cover" />
	{/if}
	<div class="hero-content text-center relative z-10">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">{data.title}</h1>
			{#if data.subtitle}
				<p class="py-6 opacity-90">{data.subtitle}</p>
			{/if}
		</div>
	</div>
</div>
