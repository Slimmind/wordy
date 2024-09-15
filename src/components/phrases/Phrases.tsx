import { useMemo, lazy } from "react";
import { useFirestore } from "../../contexts/firestore.context";
import { ItemType, ItemTypes } from "../../utils/constants";
import "./phrases.styles.css";

const Phrase = lazy(() => import("../phrase"));
const InternalWindow = lazy(() => import("../internal-window"));

export const Phrases = () => {
  const { items } = useFirestore();

  const collection = useMemo(() => {
    const wordExamples = items
      .filter(
        (item) =>
          item.type === "word" && item.examples && item.examples.length > 0,
      )
      .flatMap((item) =>
        item.examples
          ? item.examples.map((example) => ({
              value: example.value,
              id: example.id,
              wordId: item.id,
            }))
          : [],
      );

    console.log("EXAMPLES: ", wordExamples);

    const phrases: ItemType[] = items.filter(
      (item) => item.type === ItemTypes.PHRASE,
    );

    return [...phrases, ...wordExamples];
  }, [items]);

  return (
    <InternalWindow mod="phrases" title="Phrases">
      <ul className="phrases">
        {collection.map((item) => (
          <Phrase data={item} key={item.id} />
        ))}
      </ul>
    </InternalWindow>
  );
};
