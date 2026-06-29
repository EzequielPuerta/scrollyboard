import { getScrolly } from '$lib/server/scrolly';
import { generateSvelteFile } from '$lib/server/export-svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const scrolly = await getScrolly(params.id);
	if (!scrolly) return error(404, 'Scrolly not found');

	const file = generateSvelteFile(scrolly);
	const name =
		(scrolly.slug || scrolly.title || 'scrolly')
			.toString()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'scrolly';

	return new Response(file, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Content-Disposition': `attachment; filename="${name}.svelte"`
		}
	});
};
