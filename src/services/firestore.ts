/**
 * Pure Firebase/Firestore service layer.
 * No Redux — just database operations.
 */
import {
	collection,
	onSnapshot,
	where,
	query,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import db from '../firebase';
import { ItemType } from '../schemas/item.schema';

const VOCABULARY_COLLECTION = 'vocabulary';

/**
 * Subscribe to all vocabulary items (legacy, use sparingly).
 * Returns an unsubscribe function.
 */
export function subscribeToAllVocabulary(
	onNext: (items: ItemType[]) => void,
	onError?: (error: Error) => void,
): () => void {
	const unsubscribe = onSnapshot(
		collection(db, VOCABULARY_COLLECTION),
		(snapshot) => {
			const items = snapshot.docs.map(
				(docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType,
			);
			onNext(items);
		},
		(error) => {
			console.error('Firestore subscription error:', error);
			onError?.(error as Error);
		},
	);

	return unsubscribe;
}

/**
 * Subscribe to vocabulary items filtered by letter.
 * Returns an unsubscribe function.
 */
export function subscribeToItemsByLetter(
	letter: string,
	onNext: (items: ItemType[]) => void,
	onError?: (error: Error) => void,
): () => void {
	const q = query(
		collection(db, VOCABULARY_COLLECTION),
		where('letter', '==', letter),
	);

	const unsubscribe = onSnapshot(
		q,
		(snapshot) => {
			const items = snapshot.docs.map(
				(docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType,
			);
			onNext(items);
		},
		(error) => {
			console.error('Firestore subscription error:', error);
			onError?.(error as Error);
		},
	);

	return unsubscribe;
}

/**
 * Fetch vocabulary items filtered by letter (one-time, no subscription).
 */
export async function fetchItemsByLetter(letter: string): Promise<ItemType[]> {
	const q = query(
		collection(db, VOCABULARY_COLLECTION),
		where('letter', '==', letter),
	);

	const snapshot = await getDocs(q);
	return snapshot.docs.map(
		(docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType,
	);
}

/**
 * Search vocabulary items by query string (matches `original` field).
 */
export async function searchItems(queryString: string): Promise<ItemType[]> {
	const snapshot = await getDocs(collection(db, VOCABULARY_COLLECTION));
	const lowerQuery = queryString.toLowerCase();

	return snapshot.docs
		.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType)
		.filter(
			(item) =>
				item.original.toLowerCase().includes(lowerQuery) ||
				item.translations?.some((t) =>
					t.value.toLowerCase().includes(lowerQuery),
				) ||
				item.keyWords?.some((kw) => kw.toLowerCase().includes(lowerQuery)),
		);
}

/**
 * Fetch items owned by a specific user.
 */
export async function fetchItemsByOwner(userId: string): Promise<ItemType[]> {
	const snapshot = await getDocs(collection(db, VOCABULARY_COLLECTION));
	return snapshot.docs
		.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType)
		.filter((item) => item.owners?.includes(userId));
}

/**
 * Create a new vocabulary item.
 */
export async function createItem(
	item: Omit<ItemType, 'id'>,
): Promise<ItemType> {
	const docRef = await addDoc(collection(db, VOCABULARY_COLLECTION), item);
	return { ...item, id: docRef.id } as ItemType;
}

/**
 * Update an existing vocabulary item.
 */
export async function updateItem(
	itemId: string,
	updatedFields: Partial<ItemType>,
): Promise<void> {
	await updateDoc(doc(db, VOCABULARY_COLLECTION, itemId), updatedFields);
}

/**
 * Delete a vocabulary item.
 */
export async function deleteItem(itemId: string): Promise<void> {
	await deleteDoc(doc(db, VOCABULARY_COLLECTION, itemId));
}

/**
 * Fetch a single item by ID.
 */
export async function fetchItemById(itemId: string): Promise<ItemType | null> {
	const docSnap = await getDocs(collection(db, VOCABULARY_COLLECTION));
	const found = docSnap.docs.find((d) => d.id === itemId);
	if (!found) return null;
	return { id: found.id, ...found.data() } as ItemType;
}
