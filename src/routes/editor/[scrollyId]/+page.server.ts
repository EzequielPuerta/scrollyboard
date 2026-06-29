import { getScrolly } from '$lib/server/scrolly';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const scrolly = await getScrolly(params.scrollyId);
	if (!scrolly) error(404, 'Scrolly not found');
	return {
		scrolly: {
			...scrolly,
			_id: scrolly._id?.toString?.() || scrolly._id
		}
	};
};
