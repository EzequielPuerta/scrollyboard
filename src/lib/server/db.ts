import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
	if (db) return db;

	client = new MongoClient(MONGODB_URI);
	await client.connect();
	db = client.db('scrollyboard');
	return db;
}

export async function closeDb(): Promise<void> {
	if (client) {
		await client.close();
		client = null;
		db = null;
	}
}
