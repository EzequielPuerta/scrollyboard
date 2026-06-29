import type { ScrollyDoc, ScrollyComponent, ComponentType } from '$lib/types/scrolly';
import { emptyChartConfig } from '$lib/chart-config';

function randomId() {
	return Math.random().toString(36).substring(2, 11);
}

export class EditorStore {
	scrolly = $state<ScrollyDoc | null>(null);
	isDirty = $state(false);
	isSaving = $state(false);
	selectedComponentIdx = $state<number | null>(null);
	saveTimeoutId: ReturnType<typeof setTimeout> | null = null;
	thumbTimeoutId: ReturnType<typeof setTimeout> | null = null;
	private captureThumbnail: (() => Promise<string | null>) | null = null;

	constructor(initial: ScrollyDoc | null = null) {
		this.scrolly = initial;
	}

	/** The editor page registers a function that snapshots the live preview. */
	registerThumbnailCapture(fn: () => Promise<string | null>) {
		this.captureThumbnail = fn;
	}

	updateMeta(
		updates: Partial<
			Pick<ScrollyDoc, 'title' | 'description' | 'thumbnail' | 'slug' | 'theme' | 'css'>
		>
	) {
		if (!this.scrolly) return;
		Object.assign(this.scrolly, updates);
		this.markDirty();
	}

	setScrolly(doc: ScrollyDoc) {
		this.scrolly = doc;
		this.isDirty = false;
		this.selectedComponentIdx = null;
	}

	async addComponent(type: ComponentType) {
		if (!this.scrolly) return;

		let component: ScrollyComponent;

		switch (type) {
			case 'navbar':
				component = {
					type: 'navbar',
					title: 'My Navbar',
					links: [{ label: 'Home', href: '/' }],
					bg: 'base-100',
					textColor: ''
				};
				break;
			case 'hero':
				component = {
					type: 'hero',
					title: 'Welcome',
					subtitle: 'To my scrolly',
					bg: 'primary',
					textColor: ''
				};
				break;
			case 'footer':
				component = {
					type: 'footer',
					columns: [{ heading: 'Column 1', text: 'Footer text' }],
					bg: 'base-200',
					textColor: ''
				};
				break;
			case 'divider':
				component = {
					type: 'divider',
					text: 'Section Title',
					level: 2,
					bg: 'base-100',
					textColor: ''
				};
				break;
			case 'paragraph':
				component = {
					type: 'paragraph',
					content: '<p>Add your text here…</p>',
					bg: 'base-100',
					textColor: ''
				};
				break;
			case 'image':
				component = {
					type: 'image',
					src: '',
					alt: 'Image',
					caption: ''
				};
				break;
			case 'scene':
				component = {
					type: 'scene',
					layout: 'overlay',
					layoutProps: { offsetTop: '0px', offsetBottom: '0px' },
					data: { kind: 'text', content: 'Scene content' },
					steps: [{ id: randomId(), text: 'Step 1' }]
				};
				break;
			case 'chart':
				component = { type: 'chart', ...emptyChartConfig() };
				break;
		}

		this.scrolly.components.push(component);
		this.markDirty();
	}

	removeComponent(idx: number) {
		if (!this.scrolly) return;
		this.scrolly.components.splice(idx, 1);
		this.markDirty();
	}

	moveComponent(idx: number, direction: 'up' | 'down') {
		if (!this.scrolly) return;
		if (direction === 'up' && idx > 0) {
			[this.scrolly.components[idx], this.scrolly.components[idx - 1]] = [
				this.scrolly.components[idx - 1],
				this.scrolly.components[idx]
			];
			this.selectedComponentIdx = idx - 1;
		} else if (direction === 'down' && idx < this.scrolly.components.length - 1) {
			[this.scrolly.components[idx], this.scrolly.components[idx + 1]] = [
				this.scrolly.components[idx + 1],
				this.scrolly.components[idx]
			];
			this.selectedComponentIdx = idx + 1;
		}
		this.markDirty();
	}

	updateComponent(idx: number, updates: Partial<ScrollyComponent>) {
		if (!this.scrolly) return;
		Object.assign(this.scrolly.components[idx], updates);
		this.markDirty();
	}

	selectComponent(idx: number) {
		this.selectedComponentIdx = idx;
	}

	private markDirty() {
		this.isDirty = true;
		this.debouncedSave();
		this.scheduleThumbnail();
	}

	private debouncedSave() {
		if (this.saveTimeoutId) clearTimeout(this.saveTimeoutId);
		this.saveTimeoutId = setTimeout(() => this.save(), 1500);
	}

	/** Capture a fresh preview thumbnail a few seconds after the last change. */
	private scheduleThumbnail() {
		if (!this.captureThumbnail) return;
		if (this.thumbTimeoutId) clearTimeout(this.thumbTimeoutId);
		this.thumbTimeoutId = setTimeout(async () => {
			if (!this.scrolly || !this.captureThumbnail) return;
			const dataUrl = await this.captureThumbnail();
			if (!dataUrl) return;
			this.scrolly.thumbnail = dataUrl;
			// Persist the thumbnail without re-triggering another capture.
			this.isDirty = true;
			this.save();
		}, 3500);
	}

	async save() {
		if (!this.scrolly || !this.isDirty) return;
		this.isSaving = true;

		try {
			const response = await fetch(`/api/scrollies/${this.scrolly._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(this.scrolly)
			});

			if (response.ok) {
				this.isDirty = false;
			}
		} catch (error) {
			console.error('Save failed:', error);
		} finally {
			this.isSaving = false;
		}
	}
}
