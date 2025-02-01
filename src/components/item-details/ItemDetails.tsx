import { useEffect, useState, useCallback, lazy } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { ItemType, ItemDetailType } from '../../utils/constants';
import { checkIsOwner } from '../../utils/check-is-owner';
import { checkItemForExtending } from '../../utils/check-item-for-extending';
import { extendItem } from '../../utils/extend-item';
import { SimpleUser } from 'firebase/auth';
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

/**
 * Компонент для отображения списка элементов
 */
const ItemList = ({ items }: ItemListProps) => (
	<>
		{items.map((item) => (
			<li key={item.id}>{item.value}</li>
		))}
	</>
);

/**
 * Компонент для отображения действий с элементом
 */
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

/**
 * Хук для управления состоянием элемента
 */
const useItemState = (
	itemId: string,
	readItem: (id: string) => Promise<ItemType | undefined>
) => {
	const [item, setItem] = useState<ItemType>();
	const [isWordInOwnCollection, setIsWordInOwnCollection] =
		useState<boolean>(false);
	const { currentUser } = useAuth();

	useEffect(() => {
		const fetchItem = async () => {
			try {
				const itemData = await readItem(itemId);
				if (itemData) {
					setItem(itemData);
					console.log('Item extending check:', checkItemForExtending(itemData));
					if (currentUser) {
						const isOwner = checkIsOwner(
							itemData.owners ?? [],
							currentUser.uid
						);
						setIsWordInOwnCollection(isOwner);
					}
				}
			} catch (error) {
				console.error('Error fetching item:', error);
			}
		};

		fetchItem();
	}, [itemId, readItem, currentUser]);

	const isExtendable = item ? checkItemForExtending(item).canBeExtended : false;

	return { item, setItem, isWordInOwnCollection, isExtendable };
};

/**
 * Основной компонент для отображения деталей элемента
 */
export const ItemDetails = ({ itemId }: ItemDetailsProps) => {
	const navigate = useNavigate();
	const { readItem, changeItem, deleteItem } = useFirestore();
	const { currentUser } = useAuth();
	const { item, setItem, isWordInOwnCollection, isExtendable } = useItemState(
		itemId,
		readItem
	);

	const deleteHandler = useCallback(() => {
		if (!item || !currentUser) return;

		if (checkIsOwner(item.owners ?? [], currentUser.uid)) {
			const updatedOwnersList = item.owners?.filter(
				(owner) => owner !== currentUser.uid
			);
			changeItem(itemId, { ...item, owners: updatedOwnersList });
		} else {
			deleteItem(itemId);
			navigate({ to: '/' });
		}
	}, [item, currentUser, changeItem, deleteItem, navigate, itemId]);

	const extendHandler = useCallback(async () => {
		if (!item) return;

		try {
			const missingParts = checkItemForExtending(item);
			const extendedItem = await extendItem(item, missingParts);
			await changeItem(itemId, extendedItem);
			setItem(extendedItem);
		} catch (error) {
			console.error('Error extending item:', error);
		}
	}, [item, changeItem, itemId]);

	if (!item) {
		return <InternalWindow title='Loading...' />;
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
