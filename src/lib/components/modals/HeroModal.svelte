<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import VariantSelect from './VariantSelect.svelte';
	import type { HeroComponent } from '$lib/types/scrolly';

	interface Props {
		open: boolean;
		data?: HeroComponent;
		onClose: () => void;
		onSave: (data: HeroComponent) => void;
	}

	const { open, data, onClose, onSave }: Props = $props();

	let title = $state(data?.title || 'Welcome');
	let subtitle = $state(data?.subtitle || '');
	let bgImage = $state(data?.bgImage || '');
	let gradient = $state(data?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
	let bg = $state(data?.bg ?? 'primary');
	let textColor = $state(data?.textColor ?? '');

	// Background mode: a theme variant, a custom gradient, or an image.
	let bgMode = $state<'variant' | 'gradient' | 'image'>(
		data?.bgImage ? 'image' : data?.gradient ? 'gradient' : 'variant'
	);

	// Height: default (min-h-80), pixels, % of viewport (vh), or full screen.
	type HeightMode = 'default' | 'px' | 'vh' | 'screen';
	function parseHeightMode(h?: string): HeightMode {
		if (!h) return 'default';
		if (h === '100vh') return 'screen';
		if (h.endsWith('vh')) return 'vh';
		if (h.endsWith('px')) return 'px';
		return 'default';
	}
	let heightMode = $state<HeightMode>(parseHeightMode(data?.height));
	let heightValue = $state(data?.height ? parseInt(data.height) || 60 : 60);

	function resolvedHeight(): string | undefined {
		if (heightMode === 'screen') return '100vh';
		if (heightMode === 'px') return `${heightValue}px`;
		if (heightMode === 'vh') return `${heightValue}vh`;
		return undefined;
	}

	function save() {
		onSave({
			type: 'hero',
			title,
			subtitle: subtitle || undefined,
			bg,
			textColor,
			gradient: bgMode === 'gradient' ? gradient : undefined,
			bgImage: bgMode === 'image' ? bgImage : undefined,
			height: resolvedHeight()
		});
	}
</script>

{#snippet content()}
	<div class="flex flex-col w-full gap-6">
		<div>
			<label class="label">
				<span class="label-text font-semibold">Title</span>
			</label>
			<input type="text" bind:value={title} class="input input-bordered w-full" />
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">Subtitle (optional)</span>
			</label>
			<input type="text" bind:value={subtitle} class="input input-bordered w-full" />
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">Background</span>
			</label>
			<div class="join">
				<button
					type="button"
					class={`btn btn-sm join-item ${bgMode === 'variant' ? 'btn-primary' : 'btn-ghost'}`}
					onclick={() => (bgMode = 'variant')}>Variant</button
				>
				<button
					type="button"
					class={`btn btn-sm join-item ${bgMode === 'gradient' ? 'btn-primary' : 'btn-ghost'}`}
					onclick={() => (bgMode = 'gradient')}>Gradient</button
				>
				<button
					type="button"
					class={`btn btn-sm join-item ${bgMode === 'image' ? 'btn-primary' : 'btn-ghost'}`}
					onclick={() => (bgMode = 'image')}>Image</button
				>
			</div>
		</div>

		{#if bgMode === 'variant'}
			<VariantSelect label="Background variant" kind="bg" value={bg} onChange={(v) => (bg = v)} />
		{:else if bgMode === 'gradient'}
			<div>
				<label class="label">
					<span class="label-text font-semibold">Gradient CSS</span>
				</label>
				<textarea bind:value={gradient} class="textarea textarea-bordered w-full" rows="2"></textarea>
				<div
					class="w-full h-24 rounded-lg mt-2 border border-base-300"
					style={`background: ${gradient}`}
				></div>
			</div>
		{:else}
			<div>
				<label class="label">
					<span class="label-text font-semibold">Image URL</span>
				</label>
				<input
					type="url"
					bind:value={bgImage}
					class="input input-bordered w-full"
					placeholder="https://..."
				/>
			</div>
		{/if}

		<VariantSelect label="Text color" kind="text" value={textColor} onChange={(v) => (textColor = v)} />

		<div>
			<label class="label">
				<span class="label-text font-semibold">Height</span>
			</label>
			<div class="flex gap-2 items-center">
				<select bind:value={heightMode} class="select select-bordered flex-1">
					<option value="default">Default</option>
					<option value="px">Pixels</option>
					<option value="vh">% of viewport</option>
					<option value="screen">Full screen</option>
				</select>
				{#if heightMode === 'px' || heightMode === 'vh'}
					<label class="input input-bordered flex items-center gap-1 w-36">
						<input type="number" min="1" bind:value={heightValue} class="grow w-full" />
						<span class="text-base-content/50">{heightMode === 'px' ? 'px' : 'vh'}</span>
					</label>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<BaseModal {open} title="Edit Hero" {onClose} onSave={save}>
	{@render content()}
</BaseModal>
