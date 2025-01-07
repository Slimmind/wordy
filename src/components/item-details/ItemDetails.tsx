import { useEffect, useState, useCallback, lazy } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { ItemType } from '../../utils/constants';
import { checkIsOwner } from '../../utils/check-is-owner';

const DeleteIcon = lazy(() => import('../../icons/delete-icon'));
const EditIcon = lazy(() => import('../../icons/edit-icon'));
const InternalWindow = lazy(() => import('../internal-window'));
const Block = lazy(() => import('../block'));
const Button = lazy(() => import('../button'));
const OwnCollectionControl = lazy(
	() => import('../own-collection/own-collection-control')
);

type ItemDetailsProps = {
	itemId: string;
};

export const ItemDetails = ({ itemId }: ItemDetailsProps) => {
	const navigate = useNavigate();
	const { readItem, changeItem, deleteItem } = useFirestore();
	const { currentUser } = useAuth();
	const [item, setItem] = useState<ItemType>();
	const [isWordInOwnCollection, setIsWordInOwnCollection] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchWord = async () => {
			const itemData = await readItem(itemId);
			if (itemData) {
				setItem(itemData);
				if (currentUser) {
					const isOwner = checkIsOwner(itemData.owners ?? [], currentUser.uid);
					setIsWordInOwnCollection(isOwner);
				}
			}
		};

		fetchWord();
	}, [itemId, readItem, currentUser]);

	const deleteHandler = useCallback(() => {
		console.log('TEST');
		if (
			item &&
			currentUser &&
			checkIsOwner(item.owners ?? [], currentUser.uid)
		) {
			const updatedOwnersList = item.owners?.filter(
				(owner) => owner !== currentUser.uid
			);
			const updatedItem = { ...item, owners: updatedOwnersList };
			console.log('CHANGE');
			changeItem(itemId, updatedItem);
		} else {
			console.log('DELETE');
			deleteItem(itemId);
			navigate({ to: '/' });
		}
	}, [item, currentUser, changeItem, deleteItem, navigate, itemId]);

	if (!item) {
		return <InternalWindow title='Loading...' />;
	}

	return (
		<InternalWindow mod='word-details' title={item.original}>
			{!!item.translations.length && (
				<Block tag='ul' title='Translations:'>
					{item.translations.map((translation) => (
						<li key={translation.id}>{translation.value}</li>
					))}
				</Block>
			)}
			{item.synonyms && item.synonyms.length > 0 && (
				<Block tag='ul' title='Synonyms:'>
					{item.synonyms.map((synonym) => (
						<li key={synonym.id}>{synonym.value}</li>
					))}
				</Block>
			)}
			{item.examples && item.examples.length > 0 && (
				<Block tag='ol' title='Examples:'>
					{item.examples.map((example) => (
						<li key={example.id}>{example.value}</li>
					))}
				</Block>
			)}
			{!!currentUser?.email && (
				<footer className='internal-window__footer'>
					<Button mod='circle delete' onClick={deleteHandler}>
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
				</footer>
			)}
		</InternalWindow>
	);
};
