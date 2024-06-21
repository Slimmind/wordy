import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { WordType } from '../../utils/constants';
import InternalWindow from '../internal-window';
import Block from '../block';
import Button from '../button';
import OwnCollection from '../own-collection';

export const WordDetails = () => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const wordId = useParams({
		from: '/words/$wordId',
		select: (params) => params.wordId,
	});
	const [word, setWord] = useState<WordType>();
	const [isWordInOwnCollection, setIsWordInOwnCollection] =
		useState<boolean>(false);
	const { readWord, deleteWord } = useFirestore();

	useEffect(() => {
		const fetchWord = async () => {
			const wordData = await readWord(wordId);
			if (wordData) {
				const owners = wordData.owners;
				setWord(wordData);
				if (owners && currentUser) {
					const isOwner = owners.some((owner) => owner === currentUser.uid);
					setIsWordInOwnCollection(isOwner);
				}
			}
		};

		fetchWord();
	}, [wordId, readWord]);

	const deleteHandler = () => {
		deleteWord(wordId);
		navigate({ to: '/' });
	};

	if (word) {
		return (
			<InternalWindow mod='word-details' title={word.original}>
				{!!word.translations.length && (
					<Block tag='ul' title='Translations:'>
						{word?.translations.map((translation) => (
							<li key={translation.id}>{translation.value}</li>
						))}
					</Block>
				)}
				{!!word?.synonyms?.length && (
					<Block tag='ul' title='Synonyms:'>
						{word?.synonyms.map((synonym) => (
							<li key={synonym.id}>{synonym.value}</li>
						))}
					</Block>
				)}
				{!!word.examples.length && (
					<Block tag='ol' title='Examples:'>
						{word?.examples.map((example) => (
							<li key={example.id}>{example.value}</li>
						))}
					</Block>
				)}
				{!!currentUser?.email && (
					<footer className='internal-window__footer'>
						<Button mod='circle delete' onClick={deleteHandler} />
						{!isWordInOwnCollection && (
							<OwnCollection user={currentUser} word={word} />
						)}
						<Link className='btn btn--circle btn--edit'></Link>
					</footer>
				)}
			</InternalWindow>
		);
	}

	return <InternalWindow title='Loading...' />;
};
