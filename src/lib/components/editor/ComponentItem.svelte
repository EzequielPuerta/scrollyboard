<script lang="ts">
	import type { ScrollyComponent } from '$lib/types/scrolly';

	interface Props {
		component: ScrollyComponent;
		idx: number;
		isSelected: boolean;
		onSelect: () => void;
		onEdit: () => void;
		onDelete: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		canMoveUp: boolean;
		canMoveDown: boolean;
	}

	const { component, idx, isSelected, onSelect, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: Props = $props();

	function getLabel(): string {
		const c = component as any;
		const type = component.type;
		switch (type) {
			case 'navbar':
				return c.title || 'Navbar';
			case 'hero':
				return c.title || 'Hero';
			case 'footer':
				return 'Footer';
			case 'divider':
				return c.text || 'Divider';
			case 'paragraph':
				return c.content?.substring(0, 30) || 'Paragraph';
			case 'image':
				return c.alt || 'Image';
			case 'scene':
				return `Scene (${c.layout})`;
			case 'chart':
				return `${c.chartType} ${c.variant}`;
			default:
				return 'Component';
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class={`border-b border-base-300 p-3 cursor-pointer transition ${isSelected ? 'bg-primary/10' : 'hover:bg-base-200'}`}
	onmousedown={onSelect}
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex-1 min-w-0">
			<p class="font-semibold text-sm capitalize truncate">{component.type}</p>
			<p class="text-xs text-base-content/70 truncate">{getLabel()}</p>
		</div>
		<div class="flex gap-1 shrink-0">
			<button
				onmousedown={(e) => {
					e.stopPropagation();
					onEdit();
				}}
				class="btn btn-xs btn-ghost"
				title="Edit"
			>
				✎
			</button>
			<button
				onmousedown={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				class="btn btn-xs btn-ghost text-error"
				title="Delete"
			>
				✕
			</button>
		</div>
	</div>

	<div class="flex gap-1 mt-2">
		<button
			onmousedown={(e) => {
				e.stopPropagation();
				onMoveUp();
			}}
			disabled={!canMoveUp}
			class="btn btn-xs btn-ghost flex-1"
			title="Move up"
		>
			↑
		</button>
		<button
			onmousedown={(e) => {
				e.stopPropagation();
				onMoveDown();
			}}
			disabled={!canMoveDown}
			class="btn btn-xs btn-ghost flex-1"
			title="Move down"
		>
			↓
		</button>
	</div>
</div>
