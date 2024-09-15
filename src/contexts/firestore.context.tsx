import {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from 'react';
import {
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	getDoc,
} from 'firebase/firestore';
import db from '../firebase';
import { ItemType } from '../utils/constants';

interface FirestoreContextType {
	items: ItemType[];
	readItem: (itemId: string) => Promise<ItemType | undefined>;
	addItem: (word: ItemType) => Promise<void>;
	deleteItem: (itemId: string) => Promise<void>;
	changeItem: (itemId: string, updatedWord: Partial<ItemType>) => Promise<void>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(
	undefined
);

export const FirestoreProvider = ({ children }: PropsWithChildren) => {
	const [items, setItems] = useState<ItemType[]>([]);

	useEffect(() => {
		const unsubscribeWords = onSnapshot(
			collection(db, 'vocabulary'),
			(snapshot) => {
				setItems(
					snapshot.docs.map(
						(doc) => ({ id: doc.id, ...doc.data() }) as ItemType
					)
				);
			}
		);

		return () => {
			unsubscribeWords();
		};
	}, []);

	const readItem = async (itemId: string) => {
		const wordRef = doc(db, 'vocabulary', itemId);
		const wordSnapshot = await getDoc(wordRef);
		if (wordSnapshot.exists()) {
			return { id: wordSnapshot.id, ...wordSnapshot.data() } as ItemType;
		} else {
			console.log('No such document!');
		}
	};

	const addItem = async (word: ItemType) => {
		await addDoc(collection(db, 'vocabulary'), word);
	};

	const deleteItem = async (itemId: string) => {
		await deleteDoc(doc(db, 'vocabulary', itemId));
	};

	const changeItem = async (itemId: string, updatedWord: Partial<ItemType>) => {
		await updateDoc(doc(db, 'vocabulary', itemId), updatedWord);
	};

	return (
		<FirestoreContext.Provider
			value={{
				items,
				readItem,
				addItem,
				deleteItem,
				changeItem,
			}}
		>
			{children}
		</FirestoreContext.Provider>
	);
};

export const useFirestore = (): FirestoreContextType => {
	const context = useContext(FirestoreContext);
	if (!context) {
		throw new Error('useFirestore must be used within a FirestoreProvider');
	}
	return context;
};
