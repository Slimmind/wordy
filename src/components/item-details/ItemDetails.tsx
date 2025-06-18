import { useEffect, useState, useCallback, lazy } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ItemType, ItemDetailType } from '../../utils/constants';
import { checkIsOwner } from '../../utils/check-is-owner';
import { checkItemForExtending } from '../../utils/check-item-for-extending';
import { extendItem } from '../../utils/extend-item';
import { SimpleUser } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { changeItem, deleteItem } from '../../store/firebase';
import './item-details.styles.css';

const DeleteIcon = lazy(() => import('../../icons/delete-icon'));
const EditIcon = lazy(() => import('../../icons/edit-icon'));
const InternalWindow = lazy(() => import('../internal-window'));
const Block = lazy(() => import('../block'));
const Button = lazy(() => import('../button'));
const AiIcon = lazy(() => import('../../icons/ai-icon'));

const OwnCollectionControl = lazy(
  () => import('../own-collection/own-collection-control')
);

type ItemDetailsProps = {
  itemId: string;
};

type ItemListProps = {
  items: ItemDetailType[];
};

const ItemList = ({ items }: ItemListProps) => (
  <>
    {items.map((item) => (
      <li key={item.id}>{item.value}</li>
    ))}
  </>
);

type ItemActionsProps = {
  item: ItemType;
  itemId: string;
  currentUser: SimpleUser;
  isWordInOwnCollection: boolean;
  isExtendable: boolean;
  onDelete: () => void;
  onExtend: () => void;
};

const ItemActions = ({
  item,
  itemId,
  currentUser,
  isWordInOwnCollection,
  isExtendable,
  onDelete,
  onExtend,
}: ItemActionsProps) => (
  <footer className='internal-window__footer'>
    <Button mod='circle delete' onClick={onDelete}>
      <DeleteIcon />
    </Button>
    <OwnCollectionControl
      isInCollection={isWordInOwnCollection}
      user={currentUser}
      item={item}
    />
    <Link
      to={'/edit/$itemId'}
      params={{ itemId: itemId }}
      className='btn btn--circle btn--edit'
    >
      <EditIcon />
    </Link>
    {isExtendable && (
      <Button mod='circle extend' onClick={onExtend}>
        <AiIcon />
      </Button>
    )}
  </footer>
);

export const ItemDetails = ({ itemId }: ItemDetailsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  
  // Получаем все элементы из стора
  const items = useSelector((state: RootState) => state.firestore.items);
  
  // Находим текущий элемент
  const item = items.find((item) => item.id === itemId);

  const [isWordInOwnCollection, setIsWordInOwnCollection] = useState(false);
  const [isExtendable, setIsExtendable] = useState(false);

  useEffect(() => {
    if (item && currentUser) {
      const isOwner = checkIsOwner(item.owners ?? [], currentUser.uid);
      const missingParts = checkItemForExtending(item);
      
      setIsWordInOwnCollection(isOwner);
      setIsExtendable(missingParts.canBeExtended);
    }
  }, [item, currentUser]);

  const deleteHandler = useCallback(async () => {
    if (!item || !currentUser) return;

    try {
      if (checkIsOwner(item.owners ?? [], currentUser.uid)) {
        const updatedOwnersList = item.owners?.filter(
          (owner) => owner !== currentUser.uid
        );
        await dispatch(
          changeItem({
            itemId,
            updatedFields: { ...item, owners: updatedOwnersList },
          })
        ).unwrap();
      } else {
        await dispatch(deleteItem(itemId)).unwrap();
        navigate({ to: '/' });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [item, currentUser, dispatch, navigate, itemId]);

  const extendHandler = useCallback(async () => {
    if (!item) return;

    try {
      const missingParts = checkItemForExtending(item);
      const extendedItem = await extendItem(item, missingParts);
      await dispatch(
        changeItem({
          itemId,
          updatedFields: extendedItem,
        })
      ).unwrap();
    } catch (error) {
      console.error('Error extending item:', error);
    }
  }, [item, dispatch, itemId]);

  if (!item) {
    return <InternalWindow title='Not Found'>Item not found</InternalWindow>;
  }

  return (
    <InternalWindow
      mod={`item-details ${isExtendable ? 'extendable' : ''}`}
      title={item.original}
    >
      {!!item.translations.length && (
        <Block tag='ul' title='Translations:'>
          <ItemList items={item.translations} />
        </Block>
      )}
      {item.synonyms && item.synonyms.length > 0 && (
        <Block tag='ul' title='Synonyms:'>
          <ItemList items={item.synonyms} />
        </Block>
      )}
      {item.examples && item.examples.length > 0 && (
        <Block tag='ol' title='Examples:'>
          <ItemList items={item.examples} />
        </Block>
      )}
      {!!currentUser?.email && (
        <ItemActions
          item={item}
          itemId={itemId}
          currentUser={currentUser}
          isWordInOwnCollection={isWordInOwnCollection}
          isExtendable={isExtendable}
          onDelete={deleteHandler}
          onExtend={extendHandler}
        />
      )}
    </InternalWindow>
  );
};