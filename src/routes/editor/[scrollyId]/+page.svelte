<script lang="ts">
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { EditorStore } from '$lib/stores/editor.svelte';
	import Sidebar from '$lib/components/editor/Sidebar.svelte';
	import EditorPanel from '$lib/components/editor/EditorPanel.svelte';
	import PreviewPanel from '$lib/components/editor/PreviewPanel.svelte';
	import EditorNavbar from '$lib/components/editor/EditorNavbar.svelte';
	import { colorVarMap } from '$lib/scrolly-css';

	const { data }: { data: PageData } = $props();
	let editor = $state.raw(new EditorStore(data.scrolly));
	let previewEl = $state<HTMLElement>();

	// Color variables reach both the preview panel charts and the modal pickers.
	const colorMap = $derived(colorVarMap(editor.scrolly?.css));
	setContext('scrollyColors', {
		get value() {
			return colorMap;
		}
	});

	$effect(() => {
		editor.setScrolly(data.scrolly);
	});

	// Register a preview-snapshot function used to auto-generate card thumbnails.
	$effect(() => {
		if (!previewEl) return;
		editor.registerThumbnailCapture(async () => {
			try {
				const { toPng } = await import('html-to-image');
				// Use the preview's actual themed background so the snapshot is
				// faithful (not a forced white that ignores the scrolly theme).
				const bg = getComputedStyle(previewEl!).backgroundColor || undefined;
				return await toPng(previewEl!, {
					pixelRatio: 0.5,
					cacheBust: true,
					skipFonts: true,
					height: Math.min(previewEl!.clientHeight, 600),
					backgroundColor: bg
				});
			} catch (err) {
				console.warn('Thumbnail capture failed:', err);
				return null;
			}
		});
	});
</script>

<div class="flex flex-col h-screen bg-base-200">
	<EditorNavbar {editor} />
	<div class="flex flex-1 min-h-0">
		<Sidebar {editor} />
		<EditorPanel {editor} />
		<PreviewPanel {editor} bind:rootEl={previewEl} />
	</div>
</div>
