import { Link } from '@tanstack/react-router';
import { ItemType } from '../../utils/constants';
import './word.styles.css';

type WordProps = {
	word: ItemType;
};

export const Word = ({ word }: WordProps) => {
	const { id, original } = word;

	return (
		<li id={id} className='word'>
			<Link to={`/items/$itemId`} params={{ itemId: id as string }}>
				<strong>{original}</strong>
			</Link>
		</li>
	);
};
