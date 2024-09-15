import { lazy } from "react";
import { useAuth } from "../../contexts/auth.context";
import { Link } from "@tanstack/react-router";
import "./footer.styles.css";

const MainMenu = lazy(() => import("../main-menu"));
const Block = lazy(() => import("../block"));

export const Footer = () => {
  const { currentUser } = useAuth();

  return (
    <footer className="main-footer">
      <Block>
        <Link
          to="/search"
          className="btn btn--circle btn--search"
          aria-label="search button"
        />
        <MainMenu />
        {currentUser?.email && (
          <Link
            to="/add-item"
            className="btn btn--circle btn--plus"
            aria-label="add word button"
          />
        )}
      </Block>
    </footer>
  );
};
