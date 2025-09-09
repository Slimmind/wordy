import { ChangeEvent, FormEvent, lazy, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { nanoid } from 'nanoid';
import { useNavigate, useParams } from '@tanstack/react-router';

import { ItemType, ItemDetailType, ItemTypes } from '../../utils/constants';
import { extendItem } from '../../utils/extend-item';

import ButtonSwitcher from '../button-switcher';
import Input from '../input';

// Импорт слайса
import {
	createItem,
	changeItem as updateItem, // переименовываем чтобы не было конфликта с локальной
} from '../../store/firebase';

import './item-form.styles.css';
import { RootState } from '../../store/store';

const InternalWindow = lazy(() => import('../internal-window'));
const Fieldset = lazy(() => import('../fieldset'));
const Button = lazy(() => import('../button'));
const AiIcon = lazy(() => import('../../icons/ai-icon'));

export const ItemForm = () => {
	const dispatch = useAppDispatch(); // 👈 Подключаем dispatch
	const navigate = useNavigate();
	const { items } = useSelector((state: RootState) => state.firestore);
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const { searchQuery, itemId } = useParams({ strict: false });

	const [isLoading, setIsLoading] = useState(false);
	const [isMagicComplete, setIsMagicComplete] = useState(false);
	const [error, setError] = useState('');
	const [duplicateError, setDuplicateError] = useState('');

	const currentItem = items.find((item) => item.id === itemId);

	const initializeFields = (items?: ItemDetailType[]): ItemDetailType[] => {
		if (!items || items.length === 0) return [{ id: nanoid(), value: '' }];
		return items.map((item) => ({
			...item,
			id: item.id || nanoid(),
		}));
	};

	const [translations, setTranslations] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.translations)
	);
	const [synonyms, setSynonyms] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.synonyms)
	);
	const [examples, setExamples] = useState<ItemDetailType[]>(
		initializeFields(currentItem?.examples)
	);

	const [formView, setFormView] = useState<ItemTypes.WORD | ItemTypes.PHRASE>(
		currentItem ? currentItem.type : ItemTypes.WORD
	);
	const [original, setOriginal] = useState<string>(
		(currentItem?.original || searchQuery) ?? ''
	);

	// Effect to update form when currentItem changes
	useEffect(() => {
		if (currentItem) {
			setFormView(currentItem.type);
			setOriginal(currentItem.original || '');
			setTranslations(initializeFields(currentItem.translations));
			setSynonyms(initializeFields(currentItem.synonyms));
			setExamples(initializeFields(currentItem.examples));
		}
	}, [currentItem]);

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
		inputType: 'text' | 'textarea' = 'text',
		inputName: string
	) => {
		// Ensure we have at least one field
		const safeFields =
			fields && fields.length > 0 ? fields : [{ id: nanoid(), value: '' }];

		const renderInput = (field: ItemDetailType, index: number) => (
			<Input
				key={field.id}
				id={field.id}
				type={inputType}
				name={safeFields.length > 1 ? `${inputName}-${index + 1}` : inputName}
				placeholder={placeholder}
				value={field.value}
				disabled={isLoading}
				onChange={(event) => handleFieldChange(event, index, setField)}
			>
				{safeFields.length > 1 && (
					<Button
						type='button'
						mod='minus'
						disabled={isLoading}
						onClick={() => removeField(setField, field.id)}
					/>
				)}
				{index === safeFields.length - 1 && (
					<Button
						type='button'
						mod='plus'
						disabled={isLoading}
						onClick={() => addField(setField)}
					/>
				)}
			</Input>
		);

		return safeFields.length > 1 ? (
			<Fieldset title={label}>
				<>{safeFields.map((field, index) => renderInput(field, index))}</>
			</Fieldset>
		) : (
			renderInput(safeFields[0], 0)
		);
	};

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		// Check for duplicate original value using Map for O(1) lookup performance
		const itemsMap = new Map<string, string>();
		items.forEach((item) => {
			if (item?.original) {
				itemsMap.set(item.original.toLowerCase(), item.id);
			}
		});

		const isDuplicate =
			itemsMap.has(original.toLowerCase()) &&
			itemsMap.get(original.toLowerCase()) !== itemId;

		if (isDuplicate) {
			setDuplicateError('Такое слово уже есть в словаре');
			return;
		}

		// Clear any previous duplicate error
		setDuplicateError('');

		const newItem = buildItem();

		try {
			if (itemId) {
				// For updates, we only send the changed fields
				const updatedFields = { ...newItem };
				delete (updatedFields as Partial<ItemType>).id; // Remove id from updated fields
				await dispatch(updateItem({ itemId, updatedFields }));
			} else {
				await dispatch(createItem(newItem));
			}

			navigate({
				to: formView === ItemTypes.PHRASE ? '/phrases' : '/',
			});
		} catch (err) {
			console.error('Error saving item:', err);
			setError('Failed to save item');
		}
	};

	const switchFormView = (viewType: ItemTypes.WORD | ItemTypes.PHRASE) => {
		setFormView(viewType);
		// Don't reset all fields when switching view type, just reset specific fields
		if (viewType === ItemTypes.WORD) {
			// Switching to word view, ensure we have synonym and example fields
			if (synonyms.length === 0) {
				setSynonyms([{ id: nanoid(), value: '' }]);
			}
			if (examples.length === 0) {
				setExamples([{ id: nanoid(), value: '' }]);
			}
		}
		// For phrase view, we don't need to do anything special with the fields
	};

	const checkItemDetails = (arr: ItemDetailType[]): ItemDetailType[] => {
		// Filter out items with empty values, but keep items with at least one non-empty value
		const filtered = arr.filter((item) => item.value.trim() !== '');
		return filtered.length > 0 ? filtered : [];
	};

	const buildItem = (): ItemType => {
		const userId = currentUser?.uid;
		const owners = userId ? [userId] : [];
		const keyWords = original.split(' ').reduce<string[]>((acc, word) => {
			const foundItem = items.find((item) => item.original === word);
			if (foundItem?.id) acc.push(foundItem.id);
			return acc;
		}, []);

		// Handle empty original string for letter extraction
		const firstLetter =
			original.length > 0 ? original.charAt(0).toLowerCase() : '';

		const commonFields = {
			type: formView,
			original: original.toLowerCase(),
			translations: checkItemDetails(translations),
			owners,
		};

		if (formView === ItemTypes.WORD) {
			return {
				...commonFields,
				id: itemId || nanoid(), // Use existing ID for updates or generate new one
				letter: firstLetter,
				synonyms: checkItemDetails(synonyms),
				examples: checkItemDetails(examples),
			};
		}

		return {
			...commonFields,
			id: itemId || nanoid(), // Use existing ID for updates or generate new one
			letter: firstLetter,
			keyWords,
		};
	};

	const handleMagicClick = async () => {
		if (!original || isLoading) return;

		setIsLoading(true);
		setError('');

		try {
			// Handle empty original string for letter extraction
			const firstLetter =
				original.length > 0 ? original.charAt(0).toLowerCase() : '';

			const tempItem: ItemType = {
				id: itemId || nanoid(), // Use existing ID for updates or generate new one
				type: formView,
				original: original.toLowerCase(),
				letter: firstLetter,
				translations: [],
				synonyms: [],
				examples: [],
			};

			// Calculate how many items we need to generate
			const translationsNeeded = Math.max(
				0,
				3 - translations.filter((t) => t.value.trim() !== '').length
			);
			const synonymsNeeded = Math.max(
				0,
				3 - synonyms.filter((s) => s.value.trim() !== '').length
			);

			const missingParts = {
				original,
				canBeExtended: true,
				translations: {
					missingQuantity: translationsNeeded,
					existing: translations
						.filter((t) => t.value.trim() !== '')
						.map((t) => t.value),
				},
				synonyms: {
					missingQuantity: synonymsNeeded,
					existing: synonyms
						.filter((s) => s.value.trim() !== '')
						.map((s) => s.value),
				},
				examples: [],
			};

			const extendedItem = await extendItem(tempItem, missingParts);

			setTranslations(initializeFields(extendedItem.translations));
			setSynonyms(initializeFields(extendedItem.synonyms));
			setExamples(initializeFields(extendedItem.examples));
			setIsMagicComplete(true);
		} catch (error) {
			console.error('Error extending item:', error);
			setError('Failed to extend item');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<InternalWindow
			title={`${itemId ? 'Edit' : 'Add'} ${formView}`}
			mod='item-form'
		>
			{!itemId && !original && (
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
					name='original'
					placeholder={`${formView === ItemTypes.WORD ? 'Word' : 'Phrase'}...`}
					value={original}
					onChange={handleOriginalChange}
					type={formView === ItemTypes.PHRASE ? 'textarea' : 'text'}
					disabled={isLoading}
					errorMessage={duplicateError}
				/>
				{renderFields(
					translations,
					setTranslations,
					'Translation',
					'Translation...',
					formView === ItemTypes.PHRASE ? 'textarea' : 'text',
					'translation'
				)}
				{error && <div className='item-form__error'>{error}</div>}
				{duplicateError && (
					<div className='item-form__error'>{duplicateError}</div>
				)}
				{formView === ItemTypes.WORD ? (
					<>
						{renderFields(
							synonyms,
							setSynonyms,
							'Synonym',
							'Synonym...',
							'text',
							'synonym'
						)}
						{renderFields(
							examples,
							setExamples,
							'Example',
							'Example...',
							'textarea',
							'example'
						)}
					</>
				) : null}
				<div className='item-form__controls'>
					<Button
						mod='wide'
						type='submit'
						disabled={isLoading || !original || !!duplicateError}
					>
						{itemId ? 'Save' : 'Add'}
					</Button>
					{!isMagicComplete && original && (
						<Button
							type='button'
							mod='circle magic'
							onClick={handleMagicClick}
							disabled={isLoading}
						>
							<AiIcon />
						</Button>
					)}
				</div>
			</form>
		</InternalWindow>
	);
};
