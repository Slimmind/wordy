import { ChangeEvent, FormEvent, useState } from 'react';
import { nanoid } from 'nanoid';
import { useFirestore } from '../../contexts/firestore.context';
import { useNavigate } from '@tanstack/react-router';
import { type WordDetail } from '../../utils/constants';
import InternalWindow from '../internal-window';
import Button from '../button';
import Input from '../input';
import './word-form.styles.css';
import { useAuth } from '../../contexts/auth.context';

export const WordForm = () => {
	const { addWord } = useFirestore();
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [original, setOriginal] = useState<string>('');

	const [synonyms, setSynonyms] = useState<WordDetail[]>([
		{ id: nanoid(), value: '' },
	]);
	const [translations, setTranslations] = useState<WordDetail[]>([
		{ id: nanoid(), value: '' },
	]);
	const [examples, setExamples] = useState<WordDetail[]>([
		{ id: nanoid(), value: '' },
	]);

	const handleAddField = (
		setField: React.Dispatch<React.SetStateAction<WordDetail[]>>
	) => {
		setField((prevFields) => [...prevFields, { id: nanoid(), value: '' }]);
	};

	const handleOriginalChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setOriginal(event.target.value.toLowerCase());
	};

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		setField: React.Dispatch<React.SetStateAction<WordDetail[]>>
	) => {
		const { value } = event.target;
		setField((prevFields) =>
			prevFields.map((field, i) =>
				i === index ? { ...field, value: value } : field
			)
		);
	};

	const submitForm = (event: FormEvent) => {
		event.preventDefault();
    const userId = currentUser?.uid;
		const newWord = {
			original: original.toLowerCase(),
			letter: original.charAt(0).toLowerCase(),
			synonyms,
			translations,
			examples,
			owners: userId ? [userId] : [],
		};

		addWord(newWord);
		navigate({ to: '/' });
	};

	return (
		<InternalWindow title='Add Word'>
			<form className='word-form' onSubmit={submitForm}>
				<Input
					id='original'
					label='Word'
					placeholder='Word...'
					value={original}
					onChange={(event) => handleOriginalChange(event)}
				/>

				{synonyms.map((synonym, index) => (
					<Input
						key={synonym.id}
						id={synonym.id}
						label='Synonym'
						placeholder='Synonym...'
						value={synonym.value}
						onChange={(event) => handleInputChange(event, index, setSynonyms)}
					/>
				))}
				<Button
					type='button'
					mod='add bordered'
					onClick={() => handleAddField(setSynonyms)}
				></Button>

				{translations.map((translation, index) => (
					<Input
						key={translation.id}
						id={translation.id}
						label='Translation'
						placeholder='Translation...'
						value={translation.value}
						onChange={(event) =>
							handleInputChange(event, index, setTranslations)
						}
					/>
				))}
				<Button
					type='button'
					mod='add bordered'
					onClick={() => handleAddField(setTranslations)}
				></Button>

				{examples.map((example, index) => (
					<Input
						key={example.id}
						type='textarea'
						id={example.id}
						label='Example'
						placeholder='Example...'
						value={example.value}
						onChange={(event) => handleInputChange(event, index, setExamples)}
					/>
				))}
				<Button
					type='button'
					mod='add bordered'
					onClick={() => handleAddField(setExamples)}
				></Button>

				<Button type='submit' mod='wide'>
					Submit
				</Button>
			</form>
		</InternalWindow>
	);
};
