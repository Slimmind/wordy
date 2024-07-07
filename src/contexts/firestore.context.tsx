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
} from 'firebase/firestore';
import db from '../firebase';
import { PhraseType, WordType } from '../utils/constants';

interface FirestoreContextType {
	words: WordType[];
	phrases: PhraseType[];
	readWord: (wordId: string) => Promise<WordType | undefined>;
	addWord: (word: WordType) => Promise<void>;
	deleteWord: (wordId: string) => Promise<void>;
	changeWord: (wordId: string, updatedWord: Partial<WordType>) => Promise<void>;
	readPhrase: (phraseId: string) => Promise<PhraseType | undefined>;
	addPhrase: (phrase: PhraseType) => Promise<void>;
	deletePhrase: (phraseId: string) => Promise<void>;
	changePhrase: (
		phraseId: string,
		updatedPhrase: Partial<PhraseType>
	) => Promise<void>;
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
	const [phrases, setPhrases] = useState<PhraseType[]>([]);

	useEffect(() => {
		const unsubscribeWords = onSnapshot(collection(db, 'words'), (snapshot) => {
			setWords(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WordType)
			);
		});

		const unsubscribePhrases = onSnapshot(
			collection(db, 'phrases'),
			(snapshot) => {
				setPhrases(
					snapshot.docs.map(
						(doc) => ({ id: doc.id, ...doc.data() }) as PhraseType
					)
				);
			}
		);

		return () => {
			unsubscribeWords();
			unsubscribePhrases();
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

	const readPhrase = async (phraseId: string) => {
		const phraseRef = doc(db, 'phrases', phraseId);
		const phraseSnapshot = await getDoc(phraseRef);
		if (phraseSnapshot.exists()) {
			return { id: phraseSnapshot.id, ...phraseSnapshot.data() } as PhraseType;
		} else {
			console.log('No such document!');
		}
	};

	const addPhrase = async (phrase: PhraseType) => {
		await addDoc(collection(db, 'phrases'), phrase);
	};

	const deletePhrase = async (phraseId: string) => {
		await deleteDoc(doc(db, 'phrases', phraseId));
	};

	const changePhrase = async (
		phraseId: string,
		updatedPhrase: Partial<PhraseType>
	) => {
		await updateDoc(doc(db, 'phrases', phraseId), updatedPhrase);
	};

	return (
		<FirestoreContext.Provider
			value={{
				words,
				phrases,
				readWord,
				addWord,
				deleteWord,
				changeWord,
				readPhrase,
				addPhrase,
				deletePhrase,
				changePhrase,
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
