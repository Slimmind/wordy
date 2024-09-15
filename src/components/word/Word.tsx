import { Link } from '@tanstack/react-router';
import { ItemType } from '../../utils/constants';
import './word.styles.css';

type WordProps = {
	word: ItemType;
	searchQuery?: string;
};

export const Word = ({ word, searchQuery }: WordProps) => {
	const { id, original } = word;

	const highlightText = (text: string, query?: string) => {
		if (!query) return text;

		const regex = new RegExp(`(${query})`, 'gi');
		const parts = text.split(regex);

		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<span key={index} style={{ textDecoration: 'underline' }}>
					{part}
				</span>
			) : (
				part
			)
		);
	};

	return (
		<li id={id} className='word'>
			<Link to={`/items/$itemId`} params={{ itemId: id as string }}>
				<strong>{highlightText(original, searchQuery)}</strong>
			</Link>
		</li>
	);
};
