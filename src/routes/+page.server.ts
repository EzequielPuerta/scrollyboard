import { listScrollies } from '$lib/server/scrolly';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const scrollies = await listScrollies();
	return {
		scrollies: scrollies.map((s) => ({
			...s,
			_id: s._id?.toString?.() || s._id
		}))
	};
};
