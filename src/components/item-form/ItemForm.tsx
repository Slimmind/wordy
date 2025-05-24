import { ChangeEvent, FormEvent, lazy, useState } from 'react';
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

  const currentItem = items.find((item) => item.id === itemId);

  const initializeFields = (items?: ItemDetailType[]): ItemDetailType[] => {
    if (!items || items.length === 0) return [{ id: nanoid(), value: '' }];
    return items.map((item) => ({
      ...item,
      id: item.id || nanoid(),
    }));
  };

  const [translations, setTranslations] = useState<ItemDetailType[]>(
    initializeFields(currentItem?.translations) || [{ id: nanoid(), value: '' }]
  );
  const [synonyms, setSynonyms] = useState<ItemDetailType[]>(
    initializeFields(currentItem?.synonyms) || [{ id: nanoid(), value: '' }]
  );
  const [examples, setExamples] = useState<ItemDetailType[]>(
    initializeFields(currentItem?.examples) || [{ id: nanoid(), value: '' }]
  );

  const [formView, setFormView] = useState<ItemTypes.WORD | ItemTypes.PHRASE>(
    currentItem ? currentItem.type : ItemTypes.WORD
  );
  const [original, setOriginal] = useState<string>(
    (currentItem?.original || searchQuery) ?? ''
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
    inputType: 'text' | 'textarea' = 'text',
    inputName: string
  ) => {
    if (!fields || fields.length === 0) {
      fields = [{ id: nanoid(), value: '' }];
    }

    const renderInput = (field: ItemDetailType, index: number) => (
      <Input
        key={field.id}
        id={field.id}
        type={inputType}
        name={fields.length > 1 ? `${inputName}-${index + 1}` : inputName}
        placeholder={placeholder}
        value={field.value}
        disabled={isLoading}
        onChange={(event) => handleFieldChange(event, index, setField)}
      >
        {fields.length > 1 && (
          <Button
            type='button'
            mod='minus'
            disabled={isLoading}
            onClick={() => removeField(setField, field.id)}
          />
        )}
        {index === fields.length - 1 && (
          <Button
            type='button'
            mod='plus'
            disabled={isLoading}
            onClick={() => addField(setField)}
          />
        )}
      </Input>
    );

    return fields.length > 1 ? (
      <Fieldset title={label}>
        <>{fields.map((field, index) => renderInput(field, index))}</>
      </Fieldset>
    ) : (
      renderInput(fields[0], 0)
    );
  };

  const submitForm = async (event: FormEvent) => {
  event.preventDefault();
  const newItem = buildItem();

  try {
    if (itemId) {
      await dispatch(updateItem({ itemId, updatedFields: newItem }));
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

  const handleMagicClick = async () => {
    if (!original || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const tempItem: ItemType = {
        type: formView,
        original: original.toLowerCase(),
        letter: original.charAt(0).toLowerCase(),
        translations: [],
        synonyms: [],
        examples: [],
      };

      const missingParts = {
        original,
        canBeExtended: true,
        translations: {
          missingQuantity: 3,
          existing: [],
        },
        synonyms: {
          missingQuantity: 3,
          existing: [],
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
          <Button mod='wide' type='submit' disabled={isLoading || !original}>
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