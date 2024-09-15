import { lazy } from "react";
import { ItemType } from "../../utils/constants";
import "./word-group.styles.css";

const Word = lazy(() => import("../word"));

type WordGroupProps = {
  group: ItemType[];
  letter: string;
};

export const WordGroup = ({ group, letter }: WordGroupProps) => {
  return (
    <li className="word__group-wrap">
      <ul id={letter} className="word__group" data-letter={letter}>
        {group.map((word: ItemType) => (
          <Word key={word.id} word={word} />
        ))}
      </ul>
    </li>
  );
};

