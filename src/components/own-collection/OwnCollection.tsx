import { useState } from 'react';
import { User } from 'firebase/auth';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import Alert from '../alert';
import Button from '../button';
import './own-collection.styles.css';
import { SaveIcon } from '../../icons/save-icon';

type OwnCollectionProps = {
	user: User;
	word: WordType;
};

export const OwnCollection = ({ user, word }: OwnCollectionProps) => {
	const { changeWord } = useFirestore();
	const [alertIsShown, setAlertIsShown] = useState<boolean>(false);
	const owners = word.owners || [];
	owners.push(user.uid);
	const handleAddWordToOwnCollection = () => {
		const updatedWord = { ...word, owners };
		if (word.id) {
			changeWord(word.id, updatedWord);
			setAlertIsShown(true);
		}
	};
	return (
		<div className='own-collection' role='button'>
			{alertIsShown && (
				<Alert mod='global' title='Success!'>
					This word was successfully added into your own collection
				</Alert>
			)}
			<Button
				mod='circle'
				onClick={handleAddWordToOwnCollection}
				aria-label='save the word to the own collection'
			>
				<SaveIcon />
			</Button>
		</div>
	);
};
