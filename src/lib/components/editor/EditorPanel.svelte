<script lang="ts">
	import type { EditorStore } from '$lib/stores/editor.svelte';
	import ComponentItem from './ComponentItem.svelte';
	import NavbarModal from '../modals/NavbarModal.svelte';
	import HeroModal from '../modals/HeroModal.svelte';
	import FooterModal from '../modals/FooterModal.svelte';
	import DividerModal from '../modals/DividerModal.svelte';
	import ParagraphModal from '../modals/ParagraphModal.svelte';
	import ImageModal from '../modals/ImageModal.svelte';
	import SceneModal from '../modals/SceneModal.svelte';
	import ChartModal from '../modals/ChartModal.svelte';

	interface Props {
		editor: EditorStore;
	}

	const { editor }: Props = $props();

	let editingIdx = $state<number | null>(null);
	let activeModal = $state<string | null>(null);

	function openEditModal(idx: number) {
		editingIdx = idx;
		const component = editor.scrolly?.components[idx];
		if (component) {
			activeModal = component.type;
		}
	}

	function closeModal() {
		activeModal = null;
		editingIdx = null;
	}

	function saveComponent(updates: any) {
		if (editingIdx !== null) {
			editor.updateComponent(editingIdx, updates);
			closeModal();
		}
	}
</script>

<div class="w-80 bg-base-100 shadow-sm overflow-y-auto border-r border-base-300 flex flex-col">
	<div class="sticky top-0 bg-base-200 border-b border-base-300 p-4">
		<h2 class="font-bold text-lg">Components</h2>
		{#if editor.scrolly?.title}
			<p class="text-sm text-base-content/70">{editor.scrolly.title}</p>
		{/if}
	</div>

	<div class="flex-1 overflow-y-auto">
		{#if editor.scrolly?.components && editor.scrolly.components.length > 0}
			{#each editor.scrolly.components as component, idx (idx)}
				<ComponentItem
					{component}
					{idx}
					isSelected={editor.selectedComponentIdx === idx}
					onSelect={() => editor.selectComponent(idx)}
					onEdit={() => openEditModal(idx)}
					onDelete={() => editor.removeComponent(idx)}
					onMoveUp={() => idx > 0 && editor.moveComponent(idx, 'up')}
					onMoveDown={() => idx < editor.scrolly!.components.length - 1 && editor.moveComponent(idx, 'down')}
					canMoveUp={idx > 0}
					canMoveDown={idx < editor.scrolly!.components.length - 1}
				/>
			{/each}
		{:else}
			<div class="p-6 text-center text-base-content/50">
				<p class="text-sm">Add components from the sidebar</p>
			</div>
		{/if}
	</div>
</div>

{#if editor.scrolly && editingIdx !== null}
	{#if activeModal === 'navbar'}
		<NavbarModal
			open={activeModal === 'navbar'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'hero'}
		<HeroModal
			open={activeModal === 'hero'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'footer'}
		<FooterModal
			open={activeModal === 'footer'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'divider'}
		<DividerModal
			open={activeModal === 'divider'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'paragraph'}
		<ParagraphModal
			open={activeModal === 'paragraph'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'image'}
		<ImageModal
			open={activeModal === 'image'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'scene'}
		<SceneModal
			open={activeModal === 'scene'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{:else if activeModal === 'chart'}
		<ChartModal
			open={activeModal === 'chart'}
			data={editor.scrolly.components[editingIdx] as any}
			onClose={closeModal}
			onSave={saveComponent}
		/>
	{/if}
{/if}
