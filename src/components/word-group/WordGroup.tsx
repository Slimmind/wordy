import { WordType } from '../../utils/constants';
import { Word } from '../word/Word';
import './word-group.styles.css';

type WordGroupProps = {
  group: WordType[];
  letter: string;
}

export const WordGroup = ({ group, letter }: WordGroupProps) => {
  return (
    <li className="word__group-wrap">
			<ul id={letter} className="word__group" data-letter={letter}>
        {
          group.map((word: WordType) => <Word key={word.id} word={word}/>)
        }
      </ul>
    </li>
  );
}