import { useState, useCallback } from 'react';
import { checkItemForExtending } from '../ai/check-item-for-extending';
import { extendItem } from '../ai/extend';
import type { ItemType } from '../schemas/item.schema';

/**
 * Hook for AI-powered vocabulary extension.
 * Handles loading, error state, and the extension flow.
 */
export function useAIExtend() {
	const [isExtending, setIsExtending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const extend = useCallback(
		async (item: ItemType): Promise<ItemType | null> => {
			setIsExtending(true);
			setError(null);

			try {
				const missingParts = checkItemForExtending(item);

				if (!missingParts.canBeExtended) {
					setError('This item cannot be extended further');
					return null;
				}

				const result = await extendItem(item, missingParts);
				return result;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Extension failed';
				setError(message);
				return null;
			} finally {
				setIsExtending(false);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		setIsExtending(false);
		setError(null);
	}, []);

	return {
		extend,
		isExtending,
		error,
		reset,
	};
}
