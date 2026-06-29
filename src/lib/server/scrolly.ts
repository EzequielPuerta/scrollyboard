import { getDb } from './db';
import type { ScrollyDoc } from '$lib/types/scrolly';
import { ObjectId } from 'mongodb';

export async function listScrollies(): Promise<ScrollyDoc[]> {
	const db = await getDb();
	return (await db
		.collection<ScrollyDoc>('scrollies')
		.find({})
		.sort({ createdAt: -1 })
		.toArray()) as ScrollyDoc[];
}

export async function getScrolly(id: string): Promise<ScrollyDoc | null> {
	const db = await getDb();
	try {
		const result = await db.collection<ScrollyDoc>('scrollies').findOne({ _id: new ObjectId(id) });
		return result as ScrollyDoc | null;
	} catch {
		return null;
	}
}

export async function getScrollyBySlugOrId(slugOrId: string): Promise<ScrollyDoc | null> {
	const db = await getDb();
	// Prefer a custom slug match, then fall back to the ObjectId.
	const bySlug = await db.collection<ScrollyDoc>('scrollies').findOne({ slug: slugOrId });
	if (bySlug) return bySlug as ScrollyDoc;
	return getScrolly(slugOrId);
}

export async function createScrolly(data: Omit<ScrollyDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<ScrollyDoc> {
	const db = await getDb();
	const now = new Date().toISOString();
	const result = await db.collection<ScrollyDoc>('scrollies').insertOne({
		...(data as any),
		createdAt: now,
		updatedAt: now
	});

	return {
		...data,
		_id: result.insertedId.toString(),
		createdAt: now,
		updatedAt: now
	};
}

export async function updateScrolly(id: string, data: Partial<Omit<ScrollyDoc, '_id'>>): Promise<ScrollyDoc | null> {
	const db = await getDb();
	const now = new Date().toISOString();
	// _id is immutable and createdAt should never be overwritten on update.
	const { _id, createdAt, ...rest } = data as Partial<ScrollyDoc>;
	void _id;
	void createdAt;
	try {
		const result = await db.collection<ScrollyDoc>('scrollies').findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{
				$set: {
					...rest,
					updatedAt: now
				}
			},
			{ returnDocument: 'after' }
		);

		if (!result) return null;
		return result as ScrollyDoc;
	} catch {
		return null;
	}
}

export async function deleteScrolly(id: string): Promise<boolean> {
	const db = await getDb();
	const result = await db.collection('scrollies').deleteOne({ _id: new ObjectId(id) });
	return result.deletedCount > 0;
}
