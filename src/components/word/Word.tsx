import { Link } from '@tanstack/react-router';
import { PhraseType, WordType } from '../../utils/constants';
import './word.styles.css';

type WordProps = {
	word: WordType | PhraseType;
};

export const Word = ({ word }: WordProps) => {
	const { id, original } = word;

	return (
		<li id={id} className='word'>
			<Link to={`/words/$wordId`} params={{ wordId: id as string }}>
				<strong>{original}</strong>
			</Link>
		</li>
	);
};
