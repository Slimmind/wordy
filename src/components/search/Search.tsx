import Input from "../input";
import InternalWindow from "../internal-window";

export const Search = () => {
  return (
    <InternalWindow>
      <form>
        <h2>Search</h2>
        <Input type="search" />
      </form>
    </InternalWindow>
  );
}