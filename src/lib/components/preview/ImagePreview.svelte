<script lang="ts">
	import type { ImageComponent } from '$lib/types/scrolly';

	interface Props {
		data: ImageComponent;
	}

	const { data }: Props = $props();
</script>

{#if data.src}
	<figure class="py-8 bg-base-50">
		<div class="container mx-auto px-4">
			<img src={data.src} alt={data.alt} class="rounded-lg w-full object-cover max-h-96" />
		</div>
		{#if data.caption}
			<figcaption class="text-sm text-base-content/70 mt-4 text-center container mx-auto px-4">{data.caption}</figcaption>
		{/if}
	</figure>
{:else}
	<div class="py-16 bg-base-100 border-2 border-dashed border-base-300 rounded-lg m-4 flex items-center justify-center">
		<p class="text-base-content/50">Image URL required</p>
	</div>
{/if}
