import { WordType } from "../../utils/constants";
import './word.styles.css';

type WordProps = {
  word: WordType;
}

export const Word = ({ word }: WordProps) => {
  const open = () => {
    console.log('WORD: ', word);
  }
  return (
    <li id={word.id} className="word">
      <strong onClick={open}>{word.original}</strong>
    </li>
  );
}