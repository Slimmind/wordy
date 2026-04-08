import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { changeItem } from '../store/firebase';
import { checkItemForExtending } from '../ai/check-item-for-extending';
import { extendItem } from '../ai/extend';
import { ErrorBoundary } from '../components/error-boundary';
import Skeleton from '../components/skeleton';

function ExtendContent() {
	const { itemId } = Route.useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const item = useSelector((state: RootState) =>
		state.firestore.items.find((i) => i.id === itemId),
	);

	const [isExtending, setIsExtending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!item) {
			navigate({ to: '/items', replace: true });
		}
	}, [item, navigate]);

	const handleExtend = async () => {
		if (!item) return;

		setIsExtending(true);
		setError(null);
		setSuccess(false);

		try {
			const missingParts = checkItemForExtending(item);

			if (!missingParts.canBeExtended) {
				setError('This item cannot be extended further.');
				setIsExtending(false);
				return;
			}

			const extendedItem = await extendItem(item, missingParts);

			await dispatch(
				changeItem({
					itemId: item.id,
					updatedFields: {
						translations: extendedItem.translations,
						synonyms: extendedItem.synonyms,
						examples: extendedItem.examples,
						canExtend: extendedItem.canExtend,
					},
				}),
			);

			setSuccess(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to extend item');
		} finally {
			setIsExtending(false);
		}
	};

	if (!item) {
		return <Skeleton delay={3000} />;
	}

	return (
		<div className='extend-page'>
			<h1>Extend: {item.original}</h1>

			{success && (
				<div className='success-message'>
					Item extended successfully!
					<button
						type='button'
						onClick={() => navigate({ to: `/items/${item.id}` })}
					>
						View item
					</button>
				</div>
			)}

			{error && <div className='error-message'>{error}</div>}

			<button type='button' onClick={handleExtend} disabled={isExtending}>
				{isExtending ? 'Extending...' : 'Extend with AI'}
			</button>

			<button
				type='button'
				onClick={() => navigate({ to: `/items/${item.id}` })}
			>
				Cancel
			</button>
		</div>
	);
}

export const Route = createLazyFileRoute('/extend/$itemId')({
	component: () => (
		<ErrorBoundary>
			<ExtendContent />
		</ErrorBoundary>
	),
});
