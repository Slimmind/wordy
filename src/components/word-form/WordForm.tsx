import { ChangeEvent, FormEvent, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { useNavigate } from '@tanstack/react-router';
import { type WordDetail } from '../../utils/constants';
import InternalWindow from '../internal-window';
import Button from '../button';
import Input from '../input';
import './word-form.styles.css';

export const WordForm = () => {
	const { addWord } = useFirestore();
	const navigate = useNavigate();
	const [original, setOriginal] = useState<string>('');

	const [synonyms, setSynonyms] = useState<WordDetail[]>([
		{ id: 'synonym-1', value: '' },
	]);
	const [translations, setTranslations] = useState<WordDetail[]>([
		{ id: 'translation-1', value: '' },
	]);
	const [examples, setExamples] = useState<WordDetail[]>([
		{ id: 'example-1', value: '' },
	]);

	const handleAddField = (
		setField: React.Dispatch<React.SetStateAction<WordDetail[]>>,
		prefix: string
	) => {
		setField((prevFields) => [
			...prevFields,
			{ id: `${prefix}-${prevFields.length + 1}`, value: '' },
		]);
	};

	const handleOriginalChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		console.log('TEST: ', event.target.value);
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
		const newWord = {
			original: original.toLowerCase(),
			letter: original.charAt(0).toLowerCase(),
			synonyms,
			translations,
			examples,
		};

		console.log('NEW_WORD: ', newWord);
		addWord(newWord);
		navigate({ to: '/' });
	};

	return (
		<InternalWindow title='Add Word'>
			<form className='word-form' onSubmit={submitForm}>
				<Input
					id='original'
					placeholder='Word...'
					value={original}
					onChange={(event) => handleOriginalChange(event)}
				/>

				{synonyms.map((synonym, index) => (
					<Input
						key={synonym.id}
						id={synonym.id}
						placeholder='Synonym...'
						value={synonym.value}
						onChange={(event) => handleInputChange(event, index, setSynonyms)}
					/>
				))}
				<Button
					type='button'
					mod='btn--add btn--bordered'
					onClick={() => handleAddField(setSynonyms, 'synonym')}
				></Button>

				{translations.map((translation, index) => (
					<Input
						key={translation.id}
						id={translation.id}
						placeholder='Translation...'
						value={translation.value}
						onChange={(event) =>
							handleInputChange(event, index, setTranslations)
						}
					/>
				))}
				<Button
					type='button'
					mod='btn--add btn--bordered'
					onClick={() => handleAddField(setTranslations, 'translation')}
				></Button>

				{examples.map((example, index) => (
					<Input
						key={example.id}
						type='textarea'
						id={example.id}
						placeholder='Example...'
						value={example.value}
						onChange={(event) => handleInputChange(event, index, setExamples)}
					/>
				))}
				<Button
					type='button'
					mod='btn--add btn--bordered'
					onClick={() => handleAddField(setExamples, 'example')}
				></Button>

				<Button type='submit' mod='btn--wide'>
					Submit
				</Button>
			</form>
		</InternalWindow>
	);
};
