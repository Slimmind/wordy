import { lazy } from "react";
import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./header.styles.css";

const ThemeSwitcher = lazy(() => import("../theme-switcher"));

export const Header = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  return (
    <header className="main-header">
      <Link to="/">
        <h1 className="main-header__logo">FoxyWord</h1>
      </Link>
      <ThemeSwitcher />
      <div className="main-header__auth">
        {currentUser?.email ? (
          <Link to="/profile" className="main-header__auth-link">
            {currentUser.displayName && (
              <div className="main-header__profile-name">
                {currentUser.displayName}
              </div>
            )}
            <div className="btn btn--circle btn--profile"></div>
          </Link>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
    </header>
  );
};
