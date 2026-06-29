<script lang="ts">
	interface Props {
		isCreating?: boolean;
		onCreateNew?: () => void;
		searchValue?: string;
		onSearchChange?: (value: string) => void;
	}

	const { isCreating = false, onCreateNew, searchValue = '', onSearchChange }: Props = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<h1 class="text-2xl font-bold text-primary px-4">Scrollyboard</h1>
	</div>

	<div class="flex-none gap-4 px-4 flex items-center">
		<label class="input input-sm w-40 md:w-64 flex items-center gap-2 whitespace-nowrap">
			<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<g
					stroke-linejoin="round"
					stroke-linecap="round"
					stroke-width="2.5"
					fill="none"
					stroke="currentColor"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.3-4.3"></path>
				</g>
			</svg>
			<input
				type="search"
				class="grow"
				placeholder="Search by title or description..."
				value={searchValue}
				onchange={(e) => onSearchChange?.(e.currentTarget.value)}
				oninput={(e) => onSearchChange?.(e.currentTarget.value)}
			/>
		</label>

		<button onclick={onCreateNew} disabled={isCreating} class="btn btn-primary btn-sm">
			{isCreating ? 'Creating...' : '+ New Scrolly'}
		</button>
	</div>
</div>
