export const checkIsOwner = (owners: string[], userId: string): boolean =>
	owners.some((owner) => owner === userId);
