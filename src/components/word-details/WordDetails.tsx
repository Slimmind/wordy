import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { WordType } from '../../utils/constants';
import { checkIsOwner } from '../../utils/check-is-owner';
import { DeleteIcon } from '../../icons/delete-icon';
import { EditIcon } from '../../icons/edit-icon';
import InternalWindow from '../internal-window';
import Block from '../block';
import Button from '../button';
import OwnCollection from '../own-collection';

type WordDetailsProps = {
	wordId: string;
};

export const WordDetails = ({ wordId }: WordDetailsProps) => {
	const navigate = useNavigate();
	const { readWord, changeWord, deleteWord } = useFirestore();
	const { currentUser } = useAuth();
	const [word, setWord] = useState<WordType>();
	const [isWordInOwnCollection, setIsWordInOwnCollection] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchWord = async () => {
			const wordData = await readWord(wordId);
			if (wordData) {
				setWord(wordData);
				if (currentUser) {
					const isOwner = checkIsOwner(wordData.owners ?? [], currentUser.uid);
					setIsWordInOwnCollection(isOwner);
				}
			}
		};

		fetchWord();
	}, [wordId, readWord, currentUser]);

	const deleteHandler = useCallback(() => {
		if (
			word &&
			currentUser &&
			checkIsOwner(word.owners ?? [], currentUser.uid)
		) {
			const updatedOwnersList = word.owners?.filter(
				(owner) => owner !== currentUser.uid
			);
			const updatedWord = { ...word, owners: updatedOwnersList };
			console.log('CHANGE');
			changeWord(wordId, updatedWord);
		} else {
			console.log('DELETE');
			deleteWord(wordId);
			navigate({ to: '/' });
		}
	}, [word, currentUser, changeWord, deleteWord, navigate, wordId]);

	if (!word) {
		return <InternalWindow title='Loading...' />;
	}

	return (
		<InternalWindow mod='word-details' title={word.original}>
			{!!word.translations.length && (
				<Block tag='ul' title='Translations:'>
					{word.translations.map((translation) => (
						<li key={translation.id}>{translation.value}</li>
					))}
				</Block>
			)}
			{!!word.synonyms.length && (
				<Block tag='ul' title='Synonyms:'>
					{word.synonyms.map((synonym) => (
						<li key={synonym.id}>{synonym.value}</li>
					))}
				</Block>
			)}
			{!!word.examples.length && (
				<Block tag='ol' title='Examples:'>
					{word.examples.map((example) => (
						<li key={example.id}>{example.value}</li>
					))}
				</Block>
			)}
			{!!currentUser?.email && (
				<footer className='internal-window__footer'>
					<Button mod='circle delete' onClick={deleteHandler}>
						<DeleteIcon />
					</Button>
					<OwnCollection
						isInCollection={isWordInOwnCollection}
						user={currentUser}
						word={word}
					/>
					<Link
						to={`/edit/${wordId}`}
						params={{ wordId: wordId }}
						className='btn btn--circle btn--edit'
					>
						<EditIcon />
					</Link>
				</footer>
			)}
		</InternalWindow>
	);
};
