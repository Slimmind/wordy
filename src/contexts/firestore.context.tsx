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
} from 'firebase/firestore'; // Import necessary Firestore functions
import db from '../firebase';
import { SettingsType, WordType } from '../utils/constants';

interface FirestoreContextType {
	settings: SettingsType;
	words: WordType[];
	addWord: (word: WordType) => Promise<void>;
	deleteWord: (wordId: string) => Promise<void>;
	updateWord: (wordId: string, updatedWord: Partial<WordType>) => Promise<void>;
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
	const [settings, setSettings] = useState<SettingsType>({
		theme: 'black',
		color: 'seagreen',
	});
	const [words, setWords] = useState<WordType[]>([]);

	useEffect(() => {
		const unsubscribeWords = onSnapshot(collection(db, 'words'), (snapshot) => {
			setWords(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WordType)
			);
		});

		const unsubscribeSettings = onSnapshot(
			collection(db, 'settings'),
			(snapshot) => {
				const settingsData = snapshot.docs.map(
					(doc) => doc.data() as SettingsType
				);
				if (settingsData.length > 0) {
					setSettings(settingsData[0]);
				}
			}
		);

		return () => {
			unsubscribeWords();
			unsubscribeSettings();
		};
	}, []);

	// Add a new word to Firestore
	const addWord = async (word: WordType) => {
		await addDoc(collection(db, 'words'), word);
	};

	// Delete a word from Firestore
	const deleteWord = async (wordId: string) => {
		await deleteDoc(doc(db, 'words', wordId));
	};

	// Update a word in Firestore
	const updateWord = async (wordId: string, updatedWord: Partial<WordType>) => {
		await updateDoc(doc(db, 'words', wordId), updatedWord);
	};

	return (
		<FirestoreContext.Provider
			value={{ settings, words, addWord, deleteWord, updateWord }}
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
