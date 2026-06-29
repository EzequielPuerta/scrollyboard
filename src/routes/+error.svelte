<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'Something went wrong');
	const isNotFound = $derived(status === 404);
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center px-4">
	<div class="text-center max-w-md">
		<p class="text-7xl font-black text-primary/80">{status}</p>
		<h1 class="text-2xl font-bold mt-2">
			{isNotFound ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="text-base-content/60 mt-2">
			{isNotFound
				? "The scrolly or page you're looking for doesn't exist or may have been moved."
				: message}
		</p>
		<div class="flex gap-2 justify-center mt-6">
			<a href="/" class="btn btn-primary">Back to gallery</a>
			<button type="button" onclick={() => location.reload()} class="btn btn-ghost">Retry</button>
		</div>
	</div>
</div>
