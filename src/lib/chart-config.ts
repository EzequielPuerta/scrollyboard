import Papa from 'papaparse';

// Serializable mirror of the @fundar/data-chart-telling props. Only the
// DB-storable subset is modelled here (string accessors instead of functions,
// no format callbacks / custom-component markers). buildChartProps() maps a
// stored ChartConfig onto the props object spread into a chart/plot component.

export type ChartType = 'bar' | 'line' | 'heatmap' | 'pyramid';
export type ChartMode = 'chart' | 'plot';

export type LineStyleName = 'solid' | 'dashed' | 'dotted' | 'dashdot';
export type SymbolType = 'circle' | 'square' | 'triangle' | 'line';

export interface StrokeStyle {
	stroke?: string;
	strokeWidth?: number;
	strokeOpacity?: number;
	strokeDasharray?: string; // raw dasharray or a LineStyleName
	strokeLinecap?: 'butt' | 'round' | 'square';
}

export interface DotStyle {
	dotRadius?: number;
	dotFill?: string;
	dotSymbol?: SymbolType;
	dotStroke?: string;
	dotStrokeWidth?: number;
}

export interface FontStyle {
	fill?: string;
	fontSize?: number;
	fontWeight?: 'normal' | 'bold';
	fontStyle?: 'normal' | 'italic';
}

// Per-mark segment style (shape depends on chart type — the builder fills the
// right one). Stored loosely; svelteplot ignores fields it does not use.
export interface SegmentStyle {
	stroke?: StrokeStyle;
	dots?: DotStyle;
	fill?: string;
	fillOpacity?: number;
	strokeWidth?: number;
}

export interface Range {
	from?: number | string;
	to?: number | string;
}
export interface Area {
	x?: Range;
	y?: Range;
}
export interface Segment {
	areas?: Area[];
	style?: SegmentStyle;
}
export type Segments = Record<string, Segment[]>;

export type DeltaTarget = { type: 'series'; series: string } | { type: 'axis'; value?: number };

export type Marker =
	| { type: 'ruleX'; x: number | string; style?: StrokeStyle }
	| { type: 'ruleY'; y: number | string; style?: StrokeStyle }
	| {
			type: 'hover';
			series?: string;
			scope?: 'series' | 'segment';
			sync?: boolean;
			ruleX?: boolean;
			ruleY?: boolean;
			showLabels?: boolean;
			ruleStyle?: StrokeStyle;
			dotStyle?: DotStyle;
			fontStyle?: FontStyle;
	  }
	| {
			// Annotates the difference between two points/levels along an axis.
			type: 'delta';
			series?: string;
			scope?: 'series' | 'segment';
			axis: 'x' | 'y';
			at: number | string;
			from: DeltaTarget;
			to?: DeltaTarget;
			strokeStyle?: StrokeStyle;
			fontStyle?: FontStyle;
			dotStyle?: DotStyle;
	  }
	| {
			// Marks the max/min point of a series.
			type: 'peak';
			series?: string;
			scope?: 'series' | 'segment';
			mode?: 'max' | 'min';
			label?: string;
			xProp?: string;
			yProp?: string;
			dotStyle?: DotStyle;
			textStyle?: FontStyle;
	  };

export interface AxisConfig {
	type?: string;
	label?: string;
	domainMin?: number;
	domainMax?: number;
	reverse?: boolean;
	nice?: boolean;
	zero?: boolean;
	percent?: boolean;
	grid?: boolean;
	tickRotate?: number;
	tickSpacing?: number;
}

export interface Margins {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

export interface ValuesStyle {
	show?: boolean;
	anchor?: 'outside' | 'start' | 'middle' | 'end';
	dx?: number;
	dy?: number;
	rotate?: number;
}
export interface ColorsStyle {
	min?: string;
	max?: string;
	left?: string;
	right?: string;
}
export interface Styles {
	values?: ValuesStyle;
	colors?: ColorsStyle;
}

export interface LegendItem {
	name: string;
	label?: string;
	color?: string;
	symbol?: SymbolType;
	opacity?: number;
	lineStyle?: LineStyleName;
}
export type LegendSection =
	| { type: 'discrete'; title?: string; columns?: number; items: LegendItem[] }
	| {
			type: 'continuous';
			title?: string;
			columns?: number;
			min: number;
			max: number;
			colorMin?: string;
			colorMax?: string;
	  };

export interface FacetConfig {
	by: string;
	columns?: number;
	gap?: number;
}

export interface TimelineConfig {
	accessor: string;
	progress: number;
	orientation?: 'horizontal' | 'vertical';
	show?: boolean;
	thickness?: number;
	filterMode?: 'exact' | 'upTo';
	interpolate?: boolean;
}

export interface ChartConfig {
	chartType: ChartType;
	variant: ChartMode;
	csvData: string;
	x: string;
	y: string;
	z?: string;
	// chart-mode labels
	title?: string;
	subtitle?: string;
	caption?: string;
	// dimensions
	width?: number;
	height?: number;
	// advanced
	segments?: Segments;
	markers?: Marker[];
	scales?: { x?: AxisConfig; y?: AxisConfig; z?: AxisConfig };
	margins?: Margins;
	styles?: Styles;
	legend?: LegendSection[]; // chart mode only
	facet?: FacetConfig; // chart mode only
	timeline?: TimelineConfig; // chart mode only
}

export function emptyChartConfig(): ChartConfig {
	return {
		chartType: 'line',
		variant: 'chart',
		csvData: '',
		x: '',
		y: '',
		width: 600,
		height: 400
	};
}

/** Parse the stored CSV into typed rows (numbers coerced where possible). */
export function parseCsvRows(csv: string): Record<string, unknown>[] {
	if (!csv?.trim()) return [];
	const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
	return (result.data as Record<string, string>[]).map((row) => {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(row)) {
			const n = Number(v);
			out[k] = v !== '' && !Number.isNaN(n) ? n : v;
		}
		return out;
	});
}

export function csvColumns(csv: string): string[] {
	if (!csv?.trim()) return [];
	const result = Papa.parse(csv, { header: true, skipEmptyLines: true, preview: 1 });
	return result.meta.fields ?? [];
}

function isEmptyObject(v: unknown): boolean {
	return !v || (typeof v === 'object' && Object.keys(v as object).length === 0);
}

/** Convert an AxisConfig into svelteplot's AxisScale shape. */
function toAxisScale(a?: AxisConfig): Record<string, unknown> | undefined {
	if (!a) return undefined;
	const s: Record<string, unknown> = {};
	if (a.type && a.type !== 'auto') s.type = a.type;
	if (a.label !== undefined && a.label !== '') s.label = a.label;
	if (a.domainMin !== undefined && a.domainMax !== undefined)
		s.domain = [a.domainMin, a.domainMax];
	if (a.reverse) s.reverse = true;
	if (a.nice) s.nice = true;
	if (a.zero) s.zero = true;
	if (a.percent) s.percent = true;
	if (a.grid) s.grid = true;
	if (a.tickRotate !== undefined) s.tickRotate = a.tickRotate;
	if (a.tickSpacing !== undefined) s.tickSpacing = a.tickSpacing;
	return Object.keys(s).length ? s : undefined;
}

/**
 * Build the props object for a chart/plot component from a stored config and
 * the parsed rows. Empty advanced sections are dropped so the library falls
 * back to its own defaults.
 */
export function buildChartProps(config: ChartConfig, rows: Record<string, unknown>[]) {
	const props: Record<string, unknown> = {
		data: rows,
		x: config.x,
		y: config.y,
		width: config.width ?? 600,
		height: config.height ?? 400
	};
	if (config.z) props.z = config.z;

	// chart-mode-only labels/sections
	if (config.variant === 'chart') {
		if (config.title) props.title = config.title;
		if (config.subtitle) props.subtitle = config.subtitle;
		if (config.caption) props.caption = config.caption;
		if (config.legend?.length) props.legend = config.legend;
		if (config.facet?.by) props.facet = config.facet;
		if (config.timeline?.accessor)
			props.timeline = { ...config.timeline, accessor: config.timeline.accessor };
	}

	if (config.segments && Object.keys(config.segments).length) {
		props.segments = config.segments;
	}
	if (config.markers?.length) props.markers = config.markers;

	const scales: Record<string, unknown> = {};
	const sx = toAxisScale(config.scales?.x);
	const sy = toAxisScale(config.scales?.y);
	const sz = toAxisScale(config.scales?.z);
	if (sx) scales.x = sx;
	if (sy) scales.y = sy;
	if (sz) scales.z = sz;
	if (Object.keys(scales).length) props.scales = scales;

	if (!isEmptyObject(config.margins)) props.margins = config.margins;

	const styles: Record<string, unknown> = {};
	if (!isEmptyObject(config.styles?.values)) styles.values = config.styles!.values;
	if (!isEmptyObject(config.styles?.colors)) styles.colors = config.styles!.colors;
	if (Object.keys(styles).length) props.styles = styles;

	return props;
}

/**
 * Replace serialized `delta`/`peak` markers with the library's component
 * markers (which can't be stored in the DB). Other marker types pass through.
 * The component classes are injected so this stays import-free / portable.
 */
export function mapMarkers(
	markers: Marker[],
	components: { DeltaMarker: unknown; PeakMarker: unknown },
	defaults?: { x?: string; y?: string }
): unknown[] {
	return markers.map((m) => {
		if (m.type === 'delta' || m.type === 'peak') {
			const cfg: Record<string, unknown> = { ...m };
			delete cfg.type;
			delete cfg.series;
			delete cfg.scope;
			// PeakMarker reads xProp/yProp from the rows; default them to the
			// chart's encoding so it finds the data without manual config.
			if (m.type === 'peak') {
				cfg.xProp = cfg.xProp || defaults?.x;
				cfg.yProp = cfg.yProp || defaults?.y;
			}
			return {
				type: 'component',
				component: m.type === 'delta' ? components.DeltaMarker : components.PeakMarker,
				props: cfg,
				series: m.series || 'series',
				scope: m.scope || 'series'
			};
		}
		return m;
	});
}
