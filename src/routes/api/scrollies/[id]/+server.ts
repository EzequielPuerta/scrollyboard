import { json, error } from '@sveltejs/kit';
import { getScrolly, updateScrolly, deleteScrolly } from '$lib/server/scrolly';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const scrolly = await getScrolly(params.id);
	if (!scrolly) return error(404, 'Scrolly not found');
	return json(scrolly);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const scrolly = await updateScrolly(params.id, body);
	if (!scrolly) return error(404, 'Scrolly not found');
	return json(scrolly);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await deleteScrolly(params.id);
	if (!deleted) return error(404, 'Scrolly not found');
	return json({ success: true });
};
