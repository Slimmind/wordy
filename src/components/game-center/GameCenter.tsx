import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const GameCenter = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  return (
    <div>
      <h1>Game Center</h1>
      <p>Welcome to the Game Center!</p>
      {!!currentUser && (
        <div></div>
      )}
    </div>
  );
};
