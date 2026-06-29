import type { ScrollyCss } from '$lib/types/scrolly';

export const TYPO_SELECTORS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] as const;

/** Sanitize a user-typed name into a valid CSS custom-property identifier. */
export function cssVarName(name: string): string {
	return (name || '').trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Build a { name: value } lookup of the scrolly's color variables. */
export function colorVarMap(css?: ScrollyCss): Record<string, string> {
	const map: Record<string, string> = {};
	for (const v of css?.colorVars ?? []) {
		const n = cssVarName(v.name);
		if (n && v.value) map[n] = v.value;
	}
	return map;
}

/** Resolve a `var(--Name)` reference to its real value (for SVG charts). */
export function resolveCssVar(value: string | undefined, map: Record<string, string>): string | undefined {
	if (!value) return value;
	const m = /^var\(--([^)]+)\)$/.exec(value.trim());
	if (!m) return value;
	return map[m[1]] ?? value;
}

/**
 * Produce a scoped <style> body: color variables on the scope element, plus
 * typography overrides for h1-h6 and p. Only set properties are emitted so the
 * rest keeps its existing styling.
 */
export function generateScopedCss(css?: ScrollyCss, scope = '.scrolly-root'): string {
	if (!css) return '';
	let out = '';

	const vars = (css.colorVars ?? []).filter((v) => cssVarName(v.name) && v.value);
	if (vars.length) {
		out += `${scope}{${vars.map((v) => `--${cssVarName(v.name)}:${v.value};`).join('')}}\n`;
	}

	const typo = css.typography ?? {};
	for (const sel of TYPO_SELECTORS) {
		const t = typo[sel];
		if (!t) continue;
		const decls = [
			t.fontSize && `font-size:${t.fontSize}`,
			t.lineHeight && `line-height:${t.lineHeight}`,
			t.fontWeight && `font-weight:${t.fontWeight}`,
			t.letterSpacing && `letter-spacing:${t.letterSpacing}`,
			t.color && `color:${t.color}`
		]
			.filter(Boolean)
			.join(';');
		if (decls) out += `${scope} ${sel}{${decls}}\n`;
	}
	return out;
}
