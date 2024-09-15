import { ChangeEvent, FormEvent, useState, lazy } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useAuth } from '../../contexts/auth.context';
import { useFirestore } from '../../contexts/firestore.context';
import { ItemType, ItemDetailType, ItemTypes } from '../../utils/constants';
import ButtonSwitcher from '../button-switcher';
import './item-form.styles.css';

const InternalWindow = lazy(() => import('../internal-window'));
const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));
// const ButtonSwitcher = lazy(() => import('../button-switcher'));

export const ItemForm = () => {
	const { items, addItem, changeItem } = useFirestore();
	const { currentUser } = useAuth();
	const { itemId } = useParams({ strict: false });
	const navigate = useNavigate();

	const currentItem = items.find((item) => item.id === itemId);
	const initializeFields = (arr: ItemDetailType[] = []): ItemDetailType[] =>
		arr.length > 0 ? arr : [{ id: nanoid(), value: '' }];

	const [formView, setFormView] = useState<ItemTypes.WORD | ItemTypes.PHRASE>(
		currentItem ? currentItem.type : ItemTypes.WORD
	);
	const [original, setOriginal] = useState<string>(currentItem?.original ?? '');
	const [synonyms, setSynonyms] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.synonyms)
	);
	const [translations, setTranslations] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.translations)
	);
	const [examples, setExamples] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.examples)
	);

	const handleFieldChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		setField: React.Dispatch<React.SetStateAction<ItemDetailType[]>>
	) => {
		const { value } = event.target;
		setField((prevFields) =>
			prevFields.map((field, i) => (i === index ? { ...field, value } : field))
		);
	};

	const addField = (
		setField: React.Dispatch<React.SetStateAction<ItemDetailType[]>>
	) => {
		setField((prevFields) => [...prevFields, { id: nanoid(), value: '' }]);
	};

	const removeField = (
		setField: React.Dispatch<React.SetStateAction<ItemDetailType[]>>,
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

	const renderFields = (
		fields: ItemDetailType[],
		setField: React.Dispatch<React.SetStateAction<ItemDetailType[]>>,
		label: string,
		placeholder: string,
		inputType: 'text' | 'textarea' = 'text'
	) =>
		fields.map((field, index) => (
			<Input
				key={field.id}
				id={field.id}
				type={inputType}
				label={fields.length > 1 ? `${label}-${index + 1}` : label}
				placeholder={placeholder}
				value={field.value}
				onChange={(event) => handleFieldChange(event, index, setField)}
			>
				<Button
					type='button'
					mod={index === 0 ? 'plus' : 'minus'}
					onClick={() =>
						index === 0 ? addField(setField) : removeField(setField, field.id)
					}
				/>
			</Input>
		));

	const submitForm = (event: FormEvent) => {
		event.preventDefault();
		const newItem = buildItem();

		itemId ? changeItem(itemId, newItem) : addItem(newItem);
		navigate({ to: formView === ItemTypes.PHRASE ? '/phrases' : '/' });
	};

	const switchFormView = (viewType: ItemTypes.WORD | ItemTypes.PHRASE) => {
		setFormView(viewType);
		resetFields();
	};

	const checkItemDetails = (arr: ItemDetailType[]): ItemDetailType[] =>
		arr[0].value ? arr : [];

	const buildItem = (): ItemType => {
		const userId = currentUser?.uid;
		const owners = userId ? [userId] : [];
		const keyWords = original.split(' ').reduce<string[]>((acc, word) => {
			const foundItem = items.find((item) => item.original === word);
			if (foundItem?.id) acc.push(foundItem.id);
			return acc;
		}, []);

		const commonFields = {
			type: formView,
			original: original.toLowerCase(),
			translations: checkItemDetails(translations),
			owners,
		};

		if (formView === ItemTypes.WORD) {
			return {
				...commonFields,
				letter: original.charAt(0).toLowerCase(),
				synonyms: checkItemDetails(synonyms),
				examples: checkItemDetails(examples),
			};
		}

		return {
			...commonFields,
			keyWords,
		};
	};

	const resetFields = () => {
		setOriginal('');
		setSynonyms(initializeFields());
		setTranslations(initializeFields());
		setExamples(initializeFields());
	};

	return (
		<InternalWindow title={`${itemId ? 'Edit' : 'Add'} ${formView}`}>
			{!itemId && (
				<ButtonSwitcher
					firstLabel='Word'
					secondLabel='Phrase'
					firstValue={ItemTypes.WORD}
					secondValue={ItemTypes.PHRASE}
					setValue={switchFormView}
				/>
			)}
			<form onSubmit={submitForm}>
				<Input
					id='original'
					label={formView === ItemTypes.WORD ? 'Word' : ItemTypes.PHRASE}
					placeholder={`${formView === ItemTypes.WORD ? 'Word' : ItemTypes.PHRASE}...`}
					value={original}
					onChange={handleOriginalChange}
					type={formView === ItemTypes.PHRASE ? 'textarea' : 'text'}
				/>
				{formView === ItemTypes.WORD ? (
					<>
						{renderFields(synonyms, setSynonyms, 'Synonym', 'Synonym...')}
						{renderFields(
							translations,
							setTranslations,
							'Translation',
							'Translation...'
						)}
						{renderFields(
							examples,
							setExamples,
							'Example',
							'Example...',
							'textarea'
						)}
					</>
				) : (
					renderFields(
						translations,
						setTranslations,
						'Translation',
						'Translation...',
						'textarea'
					)
				)}
				<Button type='submit' mod='wide'>
					{itemId ? 'Save Changes' : 'Submit'}
				</Button>
			</form>
		</InternalWindow>
	);
};
