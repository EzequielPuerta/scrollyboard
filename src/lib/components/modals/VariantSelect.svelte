<script lang="ts">
	import { BG_OPTIONS, TEXT_OPTIONS } from '$lib/variants';

	interface Props {
		label: string;
		kind?: 'bg' | 'text';
		value: string | undefined;
		onChange: (value: string) => void;
	}

	let { label, kind = 'bg', value, onChange }: Props = $props();

	const options = $derived(kind === 'bg' ? BG_OPTIONS : TEXT_OPTIONS);
	const current = $derived(options.find((o) => o.value === (value ?? '')) ?? options[0]);
</script>

<div>
	<label class="label">
		<span class="label-text font-semibold">{label}</span>
	</label>
	<div class="flex items-center gap-2">
		<span class={`inline-block w-5 h-5 rounded border border-base-300 shrink-0 ${current.swatch}`}
		></span>
		<select
			class="select select-bordered w-full"
			value={value ?? ''}
			onchange={(e) => onChange(e.currentTarget.value)}
		>
			{#each options as o}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select>
	</div>
</div>
