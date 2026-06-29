<script lang="ts">
	import { getContext } from 'svelte';

	interface Props {
		value: string | undefined;
		onChange: (value: string) => void;
		disabled?: boolean;
	}

	let { value, onChange, disabled = false }: Props = $props();

	const colorsCtx = getContext<{ value: Record<string, string> }>('scrollyColors');
	const vars = $derived(Object.keys(colorsCtx?.value ?? {}));

	const isVar = $derived(/^var\(--/.test(value ?? ''));
	const currentVar = $derived(isVar ? (/^var\(--([^)]+)\)$/.exec(value ?? '')?.[1] ?? '') : '');
</script>

<div class="flex items-center gap-1">
	<input
		type="color"
		value={isVar ? '#000000' : (value ?? '#000000')}
		{disabled}
		oninput={(e) => onChange(e.currentTarget.value)}
		class="w-9 h-7 rounded disabled:opacity-30 {isVar ? 'opacity-40' : ''}"
	/>
	{#if vars.length}
		<select
			{disabled}
			value={currentVar}
			onchange={(e) => onChange(e.currentTarget.value ? `var(--${e.currentTarget.value})` : '#888888')}
			class="select select-bordered select-xs w-24"
			title="Use a color variable"
		>
			<option value="">custom</option>
			{#each vars as v}<option value={v}>--{v}</option>{/each}
		</select>
	{/if}
</div>
