import { PropsWithChildren } from 'react';
import { useTheme } from '../../contexts/theme.context';
import Header from '../header';
import Footer from '../footer';
import './layout.styles.css';

export const Layout = ({ children }: PropsWithChildren) => {
	const { readTheme } = useTheme();
	return (
		<div className={`layout layout--${readTheme()}`}>
			<Header />
			{children}
			<Footer />
		</div>
	);
};
