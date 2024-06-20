import React, {
	createContext,
	useContext,
	ReactNode,
	useEffect,
	useState,
} from 'react';
import {
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	getDoc,
} from 'firebase/firestore'; // Import necessary Firestore functions
import db from '../firebase';
import { WordType } from '../utils/constants';

interface FirestoreContextType {
	words: WordType[];
	readWord: (wordId: string) => Promise<WordType | undefined>;
	addWord: (word: WordType) => Promise<void>;
	deleteWord: (wordId: string) => Promise<void>;
	changeWord: (wordId: string, updatedWord: Partial<WordType>) => Promise<void>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(
	undefined
);

type FirestoreProviderProps = {
	children: ReactNode;
};

export const FirestoreProvider: React.FC<FirestoreProviderProps> = ({
	children,
}) => {
	const [words, setWords] = useState<WordType[]>([]);

	useEffect(() => {
		const unsubscribeWords = onSnapshot(collection(db, 'words'), (snapshot) => {
			setWords(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WordType)
			);
		});

		return () => {
			unsubscribeWords();
		};
	}, []);

	const readWord = async (wordId: string) => {
		const wordRef = doc(db, 'words', wordId);
		const wordSnapshot = await getDoc(wordRef);
		if (wordSnapshot.exists()) {
			return { id: wordSnapshot.id, ...wordSnapshot.data() } as WordType;
		} else {
			console.log('No such document!');
		}
	};

	const addWord = async (word: WordType) => {
		await addDoc(collection(db, 'words'), word);
	};

	const deleteWord = async (wordId: string) => {
		await deleteDoc(doc(db, 'words', wordId));
	};

	const changeWord = async (wordId: string, updatedWord: Partial<WordType>) => {
		await updateDoc(doc(db, 'words', wordId), updatedWord);
	};

	return (
		<FirestoreContext.Provider
			value={{
				words,
				readWord,
				addWord,
				deleteWord,
				changeWord,
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
