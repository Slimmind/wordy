import { useMemo, lazy } from "react";
import { ItemType, ItemTypes } from "../../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./letter-navigation.styles.css";

const Block = lazy(() => import("../block"));

type LetterNavigationProps = {
  userId?: string;
};

export const LetterNavigation = ({ userId }: LetterNavigationProps) => {
  const { items } = useSelector((state: RootState) => state.firestore);

  const letters = useMemo(() => {
    const words = items.filter((item) => item.type === ItemTypes.WORD);
    const filteredWords = userId
      ? words.filter((word) => word.owners?.includes(userId))
      : words;
    return Array.from(
      new Set(
        filteredWords
          .map((word: ItemType) => word.letter)
          .filter((letter): letter is string => !!letter),
      ),
    ).sort();
  }, [items, userId]);

  return (
    <nav className="letter__navigation">
      <Block>
        <ul className="letter__navigation-list">
          {letters.map((letter) => (
            <li key={letter} className="letter__navigation-list-item">
              <a href={`#${letter}`}>{letter}</a>
            </li>
          ))}
        </ul>
      </Block>
    </nav>
  );
};
