import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

interface ThemeContextType {
	theme: string;
	changeTheme: (newTheme: string) => void;
	readTheme: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
	children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<string>(() => {
		// Retrieve the initial theme value from localStorage or default to 'light'
		return localStorage.getItem('appTheme') || 'light';
	});

	useEffect(() => {
		// Update the localStorage whenever the theme changes
		localStorage.setItem('appTheme', theme);
	}, [theme]);

	const changeTheme = (newTheme: string) => {
		setTheme(newTheme);
	};

	const readTheme = () => {
		return theme;
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme, readTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
