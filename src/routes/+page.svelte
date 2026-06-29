<script lang="ts">
	import ScrollyCard from '$lib/components/ScrollyCard.svelte';
	import MainNavbar from '$lib/components/MainNavbar.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import type { ScrollyDoc } from '$lib/types/scrolly';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isCreating = $state(false);
	let searchValue = $state('');
	let scrollies = $state<ScrollyDoc[]>(data.scrollies);
	let pendingDelete = $state<ScrollyDoc | null>(null);

	const filteredScrollies = $derived(
		scrollies.filter((scrolly) =>
			searchValue === ''
				? true
				: scrolly.title.toLowerCase().includes(searchValue.toLowerCase()) ||
					scrolly.description.toLowerCase().includes(searchValue.toLowerCase())
		)
	);

	async function confirmDelete() {
		const s = pendingDelete;
		pendingDelete = null;
		if (!s?._id) return;
		await fetch(`/api/scrollies/${s._id}`, { method: 'DELETE' });
		scrollies = scrollies.filter((x) => x._id !== s._id);
	}

	async function createNew() {
		isCreating = true;
		try {
			const response = await fetch('/api/scrollies', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: 'Untitled Scrolly',
					description: 'Click Edit to get started',
					components: []
				})
			});
			const scrolly = await response.json();
			window.location.href = `/editor/${scrolly._id}`;
		} catch (e) {
			console.error('Failed to create scrolly:', e);
			isCreating = false;
		}
	}
</script>

<div class="min-h-screen bg-base-200">
	<MainNavbar {isCreating} onCreateNew={createNew} {searchValue} onSearchChange={(value) => (searchValue = value)} />

	<div class="container mx-auto px-4 py-8">
		<div class="mb-8">
			<h2 class="text-3xl font-bold mb-2">Welcome to Scrollyboard</h2>
			<p class="text-base-content/70">Create beautiful scrollytelling experiences with data visualizations</p>
		</div>

		{#if scrollies.length === 0}
			<div class="hero bg-base-100 rounded-lg shadow-sm">
				<div class="hero-content text-center">
					<div>
						<h3 class="text-2xl font-bold mb-4">No scrollies yet</h3>
						<p class="mb-6 text-base-content/70">Create your first scrolly to get started</p>
						<button onclick={createNew} disabled={isCreating} class="btn btn-primary">
							{isCreating ? 'Creating...' : '+ Create Scrolly'}
						</button>
					</div>
				</div>
			</div>
		{:else if filteredScrollies.length === 0}
			<div class="hero bg-base-100 rounded-lg shadow-sm">
				<div class="hero-content text-center">
					<div>
						<h3 class="text-2xl font-bold mb-4">No results found</h3>
						<p class="mb-6 text-base-content/70">Try adjusting your search terms</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredScrollies as scrolly (scrolly._id)}
					<ScrollyCard {scrolly} onDelete={(s) => (pendingDelete = s)} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<ConfirmModal
	open={pendingDelete !== null}
	title="Delete scrolly?"
	message={`"${pendingDelete?.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
	confirmLabel="Delete"
	onConfirm={confirmDelete}
	onCancel={() => (pendingDelete = null)}
/>
