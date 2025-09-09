import { lazy } from 'react';
import { ItemType } from '../../utils/constants';
import './word-group.styles.css';

const Word = lazy(() => import('../word'));

type WordGroupProps = {
	group: ItemType[];
	letter: string;
};

export const WordGroup = ({
	group,
	letter,
}: WordGroupProps) => {
	// Проверяем, что у группы есть все необходимые поля
	if (!letter) {
		console.error('WordGroup is missing required "letter" field');
		return null;
	}

	return (
		<li className='word__group-wrap'>
			<ul id={letter} className='word__group' data-letter={letter}>
				{group.map((word: ItemType) => {
					if (!word.id) {
						console.error('Word is missing required "id" field:', word);
						return null;
					}
					return <Word key={word.id} word={word} />;
				})}
			</ul>
		</li>
	);
};
