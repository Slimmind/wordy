import { lazy } from "react";
import { useTheme } from "../../contexts/theme.context";
import { THEME_DARK, THEME_LIGHT } from "../../utils/constants";
import "./theme-switcher.styles.css";

const MoonIcon = lazy(() => import("../../icons/moon-icon"));
const SunIcon = lazy(() => import("../../icons/sun-icon"));

export const ThemeSwitcher = () => {
  const { theme, changeTheme } = useTheme();
  const toggleTheme = (): void => {
    const newTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    changeTheme(newTheme);
  };
  return (
    <div role="button" className="theme-switcher" onClick={toggleTheme}>
      <SunIcon />
      <MoonIcon />
      <div
        className={`theme-switcher__roundel theme-switcher__roundel--${theme}`}
      >
        {theme === THEME_LIGHT ? <SunIcon /> : <MoonIcon />}
      </div>
    </div>
  );
};
