import { json } from '@sveltejs/kit';
import { listScrollies, createScrolly } from '$lib/server/scrolly';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const scrollies = await listScrollies();
	return json(scrollies);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const scrolly = await createScrolly({
		title: body.title || 'Untitled',
		description: body.description || '',
		components: body.components || []
	});
	return json(scrolly, { status: 201 });
};
