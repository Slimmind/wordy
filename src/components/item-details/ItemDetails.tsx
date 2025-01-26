import { useEffect, useState, useCallback, lazy } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { ItemType } from '../../utils/constants';
import { checkIsOwner } from '../../utils/check-is-owner';
import { checkItemForExtending } from '../../utils/check-item-for-extending';
import { createExtendingPrompt } from '../../utils/create-extending-prompt';
import { AIIcon } from '../../icons/ai-icon';
import { callToAI } from '../../utils/call-to-ai';
import clsx from 'clsx';

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
	const [isWordInOwnCollection, setIsWordInOwnCollection] = useState(false);
	const [isMagicHappening, setIsMagicHappening] = useState(false);

	useEffect(() => {
		const fetchItem = async () => {
			try {
				const itemData = await readItem(itemId);
				if (itemData) {
					setItem(itemData);

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

	const handleDelete = useCallback(() => {
		if (!item || !currentUser) return;

		const isOwner = checkIsOwner(item.owners ?? [], currentUser.uid);
		if (isOwner) {
			const updatedOwners = item.owners?.filter(
				(owner) => owner !== currentUser.uid
			);
			changeItem(itemId, { ...item, owners: updatedOwners });
		} else {
			deleteItem(itemId);
			navigate({ to: '/' });
		}
	}, [item, currentUser, changeItem, deleteItem, itemId, navigate]);

	const handleMagic = useCallback(async () => {
		if (!item) return;

		try {
			setIsMagicHappening(true);
			const missingParts = checkItemForExtending(item);
			const prompt = createExtendingPrompt(missingParts);

			const chatGptResponse = await callToAI(prompt);
			const updatedItem = {
				...item,
				translations: chatGptResponse.translations,
				synonyms: chatGptResponse.synonyms,
				examples: chatGptResponse.examples,
			};

			setItem(updatedItem);
		} catch (error) {
			console.error('Error processing magic handler:', error);
		} finally {
			setIsMagicHappening(false);
		}
	}, [item]);

	if (!item) {
		return <InternalWindow title='Loading...' />;
	}

	const wordDetailsClasses = clsx('word-details', { magic: isMagicHappening });

	return (
		<InternalWindow mod={wordDetailsClasses} title={item.original}>
			{item.translations?.length > 0 && (
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
					<Button mod='circle delete' onClick={handleDelete}>
						<DeleteIcon />
					</Button>
					<Button mod='circle delete' onClick={handleMagic}>
						<AIIcon />
					</Button>
					<OwnCollectionControl
						isInCollection={isWordInOwnCollection}
						user={currentUser}
						item={item}
					/>
					<Link
						to='/edit/$itemId'
						params={{ itemId }}
						className='btn btn--circle btn--edit'
					>
						<EditIcon />
					</Link>
				</footer>
			)}
		</InternalWindow>
	);
};
