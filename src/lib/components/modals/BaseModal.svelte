<script lang="ts">
	interface Props {
		open: boolean;
		title: string;
		onClose: () => void;
		onSave: () => void;
		children: any;
	}

	const { open, title, onClose, onSave, children }: Props = $props();
</script>

<dialog class="modal" class:modal-open={open}>
	<div class="modal-box w-11/12 max-w-7xl">
		<h3 class="font-bold text-lg">{title}</h3>

		<div class="py-4">
			{@render children()}
		</div>

		<div class="modal-action">
			<button type="button" onclick={onClose} class="btn btn-ghost">Cancel</button>
			<button type="button" onclick={onSave} class="btn btn-primary">Save</button>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop" onclick={onClose}>
		<button type="button">close</button>
	</form>
</dialog>

<style>
	/* DaisyUI centers the modal-box via the grid layout on .modal; keep it. */
	.modal-open {
		display: grid;
		place-items: center;
	}
</style>
