<script lang="ts">
	interface Props {
		open: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		confirmClass?: string;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		open,
		title = 'Are you sure?',
		message,
		confirmLabel = 'Confirm',
		confirmClass = 'btn-error',
		onConfirm,
		onCancel
	}: Props = $props();
</script>

<dialog class="modal" class:modal-open={open}>
	<div class="modal-box max-w-sm">
		<h3 class="font-bold text-lg">{title}</h3>
		<p class="py-4 text-sm text-base-content/80">{message}</p>
		<div class="modal-action">
			<button type="button" class="btn btn-ghost btn-sm" onclick={onCancel}>Cancel</button>
			<button type="button" class={`btn btn-sm ${confirmClass}`} onclick={onConfirm}>
				{confirmLabel}
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop" onclick={onCancel}>
		<button type="button">close</button>
	</form>
</dialog>

<style>
	.modal-open {
		display: grid;
		place-items: center;
	}
</style>
