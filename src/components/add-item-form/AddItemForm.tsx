import { ChangeEvent, FormEvent, useState } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useAuth } from '../../contexts/auth.context';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType, WordDetailType } from '../../utils/constants';
import InternalWindow from '../internal-window';
import Button from '../button';
import Input from '../input';
import ButtonSwitcher from '../button-switcher';
import './add-item-form.styles.css';

export const AddItemForm = () => {
	const { words, addWord, addPhrase, changeWord } = useFirestore();
	const { currentUser } = useAuth();
	const { wordId } = useParams({ strict: false });
	const currentWord = words.find((word) => word.id === wordId);
	const navigate = useNavigate();
	const [formView, setFormView] = useState<'word' | 'phrase'>('word');
	const [original, setOriginal] = useState<string>(currentWord?.original ?? '');
	const [synonyms, setSynonyms] = useState<WordDetailType[]>(
		currentWord?.synonyms ?? [{ id: nanoid(), value: '' }]
	);
	const [translations, setTranslations] = useState<WordDetailType[]>(
		currentWord?.translations ?? [{ id: nanoid(), value: '' }]
	);
	const [examples, setExamples] = useState<WordDetailType[]>(
		currentWord?.examples ?? [{ id: nanoid(), value: '' }]
	);

	const handleAddField = (
		setField: React.Dispatch<React.SetStateAction<WordDetailType[]>>
	) => {
		setField((prevFields) => [...prevFields, { id: nanoid(), value: '' }]);
	};

	const handleRemoveField = (
		setField: React.Dispatch<React.SetStateAction<WordDetailType[]>>,
		fieldId: string
	) => {
		setField((prevFields) =>
			prevFields.filter((field) => field.id !== fieldId)
		);
	};

	const handleOriginalChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setOriginal(event.target.value.toLowerCase());
	};

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		setField: React.Dispatch<React.SetStateAction<WordDetailType[]>>
	) => {
		const { value } = event.target;
		setField((prevFields) =>
			prevFields.map((field, i) => (i === index ? { ...field, value } : field))
		);
	};

	const renderWordDetailsFields = (
		fields: WordDetailType[],
		setField: React.Dispatch<React.SetStateAction<WordDetailType[]>>,
		label: string,
		placeholder: string,
		inputType = 'text'
	) =>
		fields.map((field, index) => (
			<Input
				key={field.id}
				id={field.id}
				type={inputType}
				label={fields.length > 1 ? `${label}-${index + 1}` : label}
				placeholder={placeholder}
				value={field.value}
				onChange={(event) => handleInputChange(event, index, setField)}
			>
				<Button
					type='button'
					mod={index === 0 ? 'plus' : 'minus'}
					onClick={() =>
						index === 0
							? handleAddField(setField)
							: field.id && handleRemoveField(setField, field.id)
					}
				></Button>
			</Input>
		));

	const submitWordForm = (event: FormEvent) => {
		event.preventDefault();
		const userId = currentUser?.uid;
		const newWord: WordType = {
			original: original.toLowerCase(),
			letter: original.charAt(0).toLowerCase(),
			synonyms,
			translations,
			examples,
			owners: userId ? [userId] : [],
		};

		wordId ? changeWord(wordId, newWord) : addWord(newWord);
		navigate({ to: '/' });
	};

	const submitPhraseForm = (event: FormEvent) => {
		event.preventDefault();
		const keyWords = original
			.split(' ')
			.reduce((acc: string[], item: string): string[] => {
				const foundWord = words.find((word) => word.original === item);
				if (foundWord && foundWord.id) {
					acc.push(foundWord.id);
				}
				return acc;
			}, []);

		const newPhrase = {
			original,
			translation: translations[0],
			keyWords,
		};
		addPhrase(newPhrase);
		navigate({ to: '/' });
	};

	const switchFormView = (viewType: 'word' | 'phrase') => {
		setOriginal('');
		setTranslations([{ id: nanoid(), value: '' }]);
		setFormView(viewType);
	};

	return (
		<InternalWindow title={`${wordId ? 'Edit' : 'Add'} ${formView}`}>
			{!wordId && (
				<ButtonSwitcher
					firstLabel='Word'
					secondLabel='Phrase'
					firstValue='word'
					secondValue='phrase'
					setValue={switchFormView}
				/>
			)}
			{formView === 'word' ? (
				<form className='word-form' onSubmit={submitWordForm}>
					<Input
						id='original'
						label='Word'
						placeholder='Word...'
						value={original}
						onChange={handleOriginalChange}
					/>
					{renderWordDetailsFields(
						synonyms,
						setSynonyms,
						'Synonym',
						'Synonym...'
					)}
					{renderWordDetailsFields(
						translations,
						setTranslations,
						'Translation',
						'Translation...'
					)}
					{renderWordDetailsFields(
						examples,
						setExamples,
						'Example',
						'Example...',
						'textarea'
					)}
					<Button type='submit' mod='wide'>
						{wordId ? 'Save Changes' : 'Submit'}
					</Button>
				</form>
			) : (
				<form className='phrase-form' onSubmit={submitPhraseForm}>
					<Input
						id='original'
						label='Phrase'
						type='textarea'
						placeholder='Phrase...'
						value={original}
						onChange={handleOriginalChange}
					/>
					{translations.map((translation, index) => (
						<Input
							key={translation.id}
							id={translation.id}
							label='Translation'
							type='textarea'
							placeholder='Translation...'
							value={translation.value}
							onChange={(event) =>
								handleInputChange(event, index, setTranslations)
							}
						/>
					))}
					<Button type='submit' mod='wide'>
						{wordId ? 'Save Changes' : 'Submit'}
					</Button>
				</form>
			)}
		</InternalWindow>
	);
};
