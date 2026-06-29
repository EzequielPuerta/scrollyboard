import type { ChartConfig, Segments, Marker } from '../chart-config';

export type ComponentType = 'navbar' | 'hero' | 'footer' | 'divider' | 'paragraph' | 'image' | 'scene' | 'chart';

export interface NavbarComponent {
	type: 'navbar';
	title: string;
	links: Array<{ label: string; href: string }>;
	/** Background variant token (e.g. 'primary'). bgColor kept for legacy docs. */
	bg?: string;
	textColor?: string;
	bgColor?: string;
}

export interface HeroComponent {
	type: 'hero';
	title: string;
	subtitle?: string;
	bgImage?: string;
	gradient?: string;
	bg?: string;
	textColor?: string;
	/** CSS min-height for the hero, e.g. '400px', '60vh', '100vh'. */
	height?: string;
}

export interface FooterColumn {
	heading: string;
	text: string;
}

export interface FooterComponent {
	type: 'footer';
	columns: FooterColumn[];
	bg?: string;
	textColor?: string;
	bgColor?: string;
}

export interface DividerComponent {
	type: 'divider';
	text: string;
	level: 1 | 2 | 3 | 4;
	bg?: string;
	textColor?: string;
	/** Legacy text color class. */
	color?: string;
}

export interface ParagraphComponent {
	type: 'paragraph';
	/** Rich text HTML produced by the Lexical editor. */
	content: string;
	bg?: string;
	textColor?: string;
}

export interface ImageComponent {
	type: 'image';
	src: string;
	alt: string;
	caption?: string;
}

/** Which Step lifecycle callback fires the trigger. */
export type StepEventType = 'onEnter' | 'onComplete' | 'onExit' | 'onInactive' | 'onReturn';

/** A single change applied to the scene's chart when a trigger fires. */
export type StepChange =
	| { target: 'markers'; mode: 'set' | 'add'; markers: Marker[] }
	| { target: 'segments'; mode: 'set' | 'merge'; segments: Segments };

export interface StepTrigger {
	id: string;
	event: StepEventType;
	changes: StepChange[];
}

export interface StepConfig {
	id: string;
	text: string;
	showData?: boolean | 'force-refresh';
	threshold?: { type: 'percentage' | 'px' | 'rootMargin'; value: number | string };
	/** Callbacks that mutate the scene chart's segments/markers when reached. */
	triggers?: StepTrigger[];
}

export type SceneData =
	| { kind: 'text'; content: string }
	| { kind: 'image'; src: string; alt: string }
	| ({ kind: 'chart' } & ChartConfig);

/** A chart placed directly on the page, outside any scene. */
export type ChartComponent = { type: 'chart' } & ChartConfig;

export interface SceneComponent {
	type: 'scene';
	layout: 'overlay' | 'side-by-side' | 'slide';
	layoutProps: Record<string, unknown>;
	data: SceneData;
	steps: StepConfig[];
}

export type ScrollyComponent =
	| NavbarComponent
	| HeroComponent
	| FooterComponent
	| DividerComponent
	| ParagraphComponent
	| ImageComponent
	| SceneComponent
	| ChartComponent;

import type { ObjectId } from 'mongodb';

/** A reusable CSS color variable: name 'Mujeres' → usable as var(--Mujeres). */
export interface ColorVar {
	name: string;
	value: string;
}

export interface TypographyStyle {
	fontSize?: string;
	lineHeight?: string;
	fontWeight?: string;
	letterSpacing?: string;
	color?: string;
}

/** Per-scrolly custom CSS: color variables + typography for h1-h6 and p. */
export interface ScrollyCss {
	colorVars?: ColorVar[];
	typography?: Record<string, TypographyStyle>;
}

export interface ScrollyDoc {
	_id?: string | ObjectId;
	title: string;
	description: string;
	thumbnail?: string;
	/** Custom URL slug for the public view; falls back to _id when empty. */
	slug?: string;
	/** DaisyUI theme applied only to this scrolly's preview / public view. */
	theme?: string;
	/** Per-scrolly color variables + typography. */
	css?: ScrollyCss;
	createdAt: string;
	updatedAt: string;
	components: ScrollyComponent[];
}
