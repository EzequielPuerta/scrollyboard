// Single source of truth for DaisyUI semantic color variants used across all
// components. Nothing in the app should hardcode a color class: it picks a
// variant token here and resolves it through these helpers, which also provide
// sensible defaults and auto-contrast text.

export interface VariantOption {
	value: string;
	label: string;
	/** A bg-* class used purely to render a swatch in the picker UI. */
	swatch: string;
}

// Background (surface) choices.
export const BG_OPTIONS: VariantOption[] = [
	{ value: 'base-100', label: 'Base 100', swatch: 'bg-base-100' },
	{ value: 'base-200', label: 'Base 200', swatch: 'bg-base-200' },
	{ value: 'base-300', label: 'Base 300', swatch: 'bg-base-300' },
	{ value: 'neutral', label: 'Neutral', swatch: 'bg-neutral' },
	{ value: 'primary', label: 'Primary', swatch: 'bg-primary' },
	{ value: 'secondary', label: 'Secondary', swatch: 'bg-secondary' },
	{ value: 'accent', label: 'Accent', swatch: 'bg-accent' },
	{ value: 'info', label: 'Info', swatch: 'bg-info' },
	{ value: 'success', label: 'Success', swatch: 'bg-success' },
	{ value: 'warning', label: 'Warning', swatch: 'bg-warning' },
	{ value: 'error', label: 'Error', swatch: 'bg-error' }
];

// Text color choices. '' means "auto": contrast against the background.
export const TEXT_OPTIONS: VariantOption[] = [
	{ value: '', label: 'Auto (contrast)', swatch: 'bg-base-content' },
	{ value: 'base-content', label: 'Base content', swatch: 'bg-base-content' },
	{ value: 'neutral', label: 'Neutral', swatch: 'bg-neutral' },
	{ value: 'primary', label: 'Primary', swatch: 'bg-primary' },
	{ value: 'secondary', label: 'Secondary', swatch: 'bg-secondary' },
	{ value: 'accent', label: 'Accent', swatch: 'bg-accent' },
	{ value: 'info', label: 'Info', swatch: 'bg-info' },
	{ value: 'success', label: 'Success', swatch: 'bg-success' },
	{ value: 'warning', label: 'Warning', swatch: 'bg-warning' },
	{ value: 'error', label: 'Error', swatch: 'bg-error' }
];

// Literal class maps — kept as full strings so the Tailwind v4 scanner emits them.
const BG_CLASS: Record<string, string> = {
	'base-100': 'bg-base-100',
	'base-200': 'bg-base-200',
	'base-300': 'bg-base-300',
	neutral: 'bg-neutral',
	primary: 'bg-primary',
	secondary: 'bg-secondary',
	accent: 'bg-accent',
	info: 'bg-info',
	success: 'bg-success',
	warning: 'bg-warning',
	error: 'bg-error'
};

// Foreground color that contrasts with each surface (used for "auto" text).
const CONTENT_CLASS: Record<string, string> = {
	'base-100': 'text-base-content',
	'base-200': 'text-base-content',
	'base-300': 'text-base-content',
	neutral: 'text-neutral-content',
	primary: 'text-primary-content',
	secondary: 'text-secondary-content',
	accent: 'text-accent-content',
	info: 'text-info-content',
	success: 'text-success-content',
	warning: 'text-warning-content',
	error: 'text-error-content'
};

// Explicit text colors (the variant color itself).
const TEXT_CLASS: Record<string, string> = {
	'base-content': 'text-base-content',
	neutral: 'text-neutral',
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent',
	info: 'text-info',
	success: 'text-success',
	warning: 'text-warning',
	error: 'text-error'
};

/** Strip a legacy `bg-` prefix so `bg-base-100` and `base-100` both resolve. */
function bgToken(v?: string): string | undefined {
	if (!v) return undefined;
	return v.startsWith('bg-') ? v.slice(3) : v;
}

export function resolveBg(value: string | undefined, fallback = 'base-100'): string {
	const token = bgToken(value);
	if (token && BG_CLASS[token]) return BG_CLASS[token];
	return BG_CLASS[fallback] ?? BG_CLASS['base-100'];
}

export function resolveText(
	textValue: string | undefined,
	bgValue?: string,
	bgFallback = 'base-100'
): string {
	// Explicit text color (tolerate legacy full `text-*` classes too).
	if (textValue) {
		if (textValue.startsWith('text-')) return textValue;
		if (TEXT_CLASS[textValue]) return TEXT_CLASS[textValue];
	}
	// Auto: contrast against the resolved background.
	const token = bgToken(bgValue);
	if (token && CONTENT_CLASS[token]) return CONTENT_CLASS[token];
	return CONTENT_CLASS[bgFallback] ?? 'text-base-content';
}
