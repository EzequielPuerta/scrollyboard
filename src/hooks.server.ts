import { seedDatabase } from '$lib/server/seed';

seedDatabase().catch(console.error);

export {};
