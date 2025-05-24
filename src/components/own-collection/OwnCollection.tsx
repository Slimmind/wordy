import { useEffect, useState, lazy } from "react";
import { ItemType } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { listenToItems } from "../../store/firebase";
import "./own-collection.styles.css";

const InternalWindow = lazy(() => import("../internal-window"));
const Word = lazy(() => import("../word"));

type OwnCollectionProps = {
  userId: string;
};

export const OwnCollection = ({ userId }: OwnCollectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.firestore);
  
  useEffect(() => {
    const unsubscribe = dispatch(listenToItems());
    return () => unsubscribe();
  }, [dispatch]);
  const [userCollection, setUserCollection] = useState<ItemType[]>([]);

  useEffect(() => {
    setUserCollection(
      userId
        ? items.filter(
            (item) =>
              Array.isArray(item.owners) && item.owners.includes(userId),
          )
        : items,
    );
  }, [items, userId]);

  return (
    <InternalWindow title="Your own collection" mod="own-collection">
      <ul className="own-collection">
        {userCollection.map((word: ItemType) => (
          <li key={word.id} className="own-collection__item">
            <Word word={word} />
          </li>
        ))}
      </ul>
    </InternalWindow>
  );
};
