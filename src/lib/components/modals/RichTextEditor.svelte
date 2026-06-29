<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value?: string;
		onChange: (html: string) => void;
		placeholder?: string;
	}

	let { value = '', onChange, placeholder = 'Write something…' }: Props = $props();

	let editorEl: HTMLDivElement;
	let editor: any;
	let isEmpty = $state(true);
	const active = $state({ bold: false, italic: false, underline: false, strikethrough: false });

	// Toolbar handlers, wired up once Lexical is loaded (client only).
	let format: (f: string) => void = () => {};
	let toggleList: (ordered: boolean) => void = () => {};
	let insertLink: () => void = () => {};

	onMount(() => {
		let cleanup = () => {};

		(async () => {
			const lexical = await import('lexical');
			const { registerRichText, HeadingNode, QuoteNode } = await import('@lexical/rich-text');
			const { registerHistory, createEmptyHistoryState } = await import('@lexical/history');
			const html = await import('@lexical/html');
			const list = await import('@lexical/list');
			const linkMod = await import('@lexical/link');
			const { mergeRegister } = await import('@lexical/utils');

			// Alias the $-prefixed exports: Svelte reserves leading `$` identifiers.
			const {
				createEditor,
				$getRoot: getRoot,
				$getSelection: getSelection,
				$isRangeSelection: isRangeSelection,
				$insertNodes: insertNodes,
				$createParagraphNode: createParagraphNode,
				FORMAT_TEXT_COMMAND,
				SELECTION_CHANGE_COMMAND,
				COMMAND_PRIORITY_LOW
			} = lexical as any;
			const generateHtml = (html as any).$generateHtmlFromNodes;
			const generateNodesFromDOM = (html as any).$generateNodesFromDOM;
			const toggleLink = (linkMod as any).$toggleLink ?? (linkMod as any).toggleLink;

			editor = createEditor({
				namespace: 'paragraph-editor',
				nodes: [HeadingNode, QuoteNode, list.ListNode, list.ListItemNode, linkMod.LinkNode],
				onError: (e: unknown) => console.error(e),
				theme: {
					paragraph: 'mb-2',
					text: {
						bold: 'font-bold',
						italic: 'italic',
						underline: 'underline',
						strikethrough: 'line-through'
					},
					list: { ul: 'list-disc ml-6', ol: 'list-decimal ml-6', listitem: 'mb-1' },
					link: 'link link-primary'
				}
			});
			editor.setRootElement(editorEl);

			cleanup = mergeRegister(
				registerRichText(editor),
				registerHistory(editor, createEmptyHistoryState(), 300),
				list.registerList(editor),
				editor.registerCommand(
					linkMod.TOGGLE_LINK_COMMAND,
					(url: string | null) => {
						if (toggleLink) toggleLink(url);
						return true;
					},
					COMMAND_PRIORITY_LOW
				),
				editor.registerCommand(
					SELECTION_CHANGE_COMMAND,
					() => {
						const sel = getSelection();
						if (isRangeSelection(sel)) {
							active.bold = sel.hasFormat('bold');
							active.italic = sel.hasFormat('italic');
							active.underline = sel.hasFormat('underline');
							active.strikethrough = sel.hasFormat('strikethrough');
						}
						return false;
					},
					COMMAND_PRIORITY_LOW
				),
				editor.registerUpdateListener(({ editorState }: any) => {
					editorState.read(() => {
						isEmpty = getRoot().getTextContent().trim().length === 0;
						onChange(generateHtml(editor, null));
					});
				})
			);

			// Seed the editor from existing HTML (or plain text for legacy docs).
			editor.update(
				() => {
					const root = getRoot();
					root.clear();
					const p = createParagraphNode();
					root.append(p);
					p.select();
					if (value && value.trim()) {
						const dom = new DOMParser().parseFromString(value, 'text/html');
						insertNodes(generateNodesFromDOM(editor, dom));
					}
				},
				{ tag: 'history-merge' }
			);

			format = (f) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, f);
			toggleList = (ordered) =>
				editor.dispatchCommand(
					ordered ? list.INSERT_ORDERED_LIST_COMMAND : list.INSERT_UNORDERED_LIST_COMMAND,
					undefined
				);
			insertLink = () => {
				const url = window.prompt('Link URL:');
				if (url === null) return;
				editor.dispatchCommand(linkMod.TOGGLE_LINK_COMMAND, url || null);
			};
		})();

		return () => cleanup();
	});

	const btn = (on: boolean) => `btn btn-xs join-item ${on ? 'btn-active btn-primary' : 'btn-ghost'}`;
</script>

<div class="border border-base-300 rounded-lg overflow-hidden">
	<div class="flex flex-wrap gap-1 p-2 bg-base-200 border-b border-base-300">
		<div class="join">
			<button type="button" class={btn(active.bold)} onclick={() => format('bold')} title="Bold">
				<b>B</b>
			</button>
			<button type="button" class={btn(active.italic)} onclick={() => format('italic')} title="Italic">
				<i>I</i>
			</button>
			<button
				type="button"
				class={btn(active.underline)}
				onclick={() => format('underline')}
				title="Underline"
			>
				<u>U</u>
			</button>
			<button
				type="button"
				class={btn(active.strikethrough)}
				onclick={() => format('strikethrough')}
				title="Strikethrough"
			>
				<s>S</s>
			</button>
		</div>
		<div class="join">
			<button type="button" class="btn btn-xs join-item btn-ghost" onclick={() => toggleList(false)} title="Bullet list">
				• List
			</button>
			<button type="button" class="btn btn-xs join-item btn-ghost" onclick={() => toggleList(true)} title="Numbered list">
				1. List
			</button>
			<button type="button" class="btn btn-xs join-item btn-ghost" onclick={insertLink} title="Link">
				🔗
			</button>
		</div>
	</div>

	<div class="relative bg-base-100">
		<div
			bind:this={editorEl}
			contenteditable="true"
			role="textbox"
			tabindex="0"
			aria-label="Rich text editor"
			class="prose-sm max-w-none px-3 py-2 min-h-32 outline-none focus:outline-none text-base-content"
		></div>
		{#if isEmpty}
			<span class="pointer-events-none absolute top-2 left-3 text-base-content/40">{placeholder}</span>
		{/if}
	</div>
</div>
