import { useState } from 'react';
import { User } from 'firebase/auth';
import { useFirestore } from '../../../contexts/firestore.context';
import { WordType } from '../../../utils/constants';
import { HeartIcon } from '../../../icons/heart-icon';
import { BrokeHeartIcon } from '../../../icons/broken-heart-icon';
import Alert from '../../alert';
import Button from '../../button';

type OwnCollectionControlProps = {
	isInCollection: boolean;
	user: User;
	word: WordType;
};

export const OwnCollectionControl = ({
	isInCollection,
	user,
	word,
}: OwnCollectionControlProps) => {
	const { changeWord } = useFirestore();
	const [isOwner, setIsOwner] = useState(isInCollection);
	const [alertIsShown, setAlertIsShown] = useState(false);

	const handleItemInOwnCollection = () => {
		const owners = isInCollection
			? word.owners?.filter((owner) => owner !== user.uid) || []
			: [...(word.owners || []), user.uid];

		const updatedWord = { ...word, owners };

		if (word.id) {
			changeWord(word.id, updatedWord);
			setAlertIsShown(true);
			setIsOwner(!isOwner);
		}
	};

	return (
		<div className='own-collection__control' role='button'>
			<Alert shown={alertIsShown} mod='global' title='Success!'>
				This word was successfully added to your own collection.
			</Alert>
			<Button
				mod='circle'
				onClick={handleItemInOwnCollection}
				aria-label='Save the word to your own collection'
			>
				{isOwner ? <BrokeHeartIcon /> : <HeartIcon />}
			</Button>
		</div>
	);
};
