import {
	createContext,
	useContext,
	useState,
	useEffect,
	PropsWithChildren,
} from 'react';

interface ThemeContextType {
	theme: string;
	changeTheme: (newTheme: string) => void;
	readTheme: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<string>(() => {
		return localStorage.getItem('appTheme') || 'light';
	});

	useEffect(() => {
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
