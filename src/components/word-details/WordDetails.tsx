import { useEffect, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import InternalWindow from '../internal-window';
import { WordType } from '../../utils/constants';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Block from '../block';
import Button from '../button';
import updateWord from '../../utils/update-word';

export const WordDetails = () => {
	const navigate = useNavigate();
	const wordId = useParams({
		from: '/words/$wordId',
		select: (params) => params.wordId,
	});
	console.log('ID: ', wordId);
	const [word, setWord] = useState<WordType>();
	const { readWord, changeWord, deleteWord } = useFirestore(); // Destructure the readWord method from the context

	useEffect(() => {
		const fetchWord = async () => {
			const wordData = await readWord(wordId);
			if (wordData) {
				const updatedWord = updateWord(wordData);
				setWord(updatedWord);
				changeWord(wordId, updatedWord);
				console.log('WORD_DATA: ', updatedWord);
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
				<footer className='internal-window__footer'>
					<Button mod='btn--circle btn--delete' onClick={deleteHandler} />
					<Link className='btn btn--circle btn--edit'></Link>
				</footer>
			</InternalWindow>
		);
	}

	return <InternalWindow title='Loading...' />;
};
