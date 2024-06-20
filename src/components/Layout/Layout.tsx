import { PropsWithChildren } from 'react';
import Header from '../header';
import Footer from '../footer';
import './layout.styles.css';
import { useTheme } from '../../contexts/theme.context';

export const Layout = ({ children }: PropsWithChildren) => {
	const { readTheme } = useTheme();
	return (
		<div className={`layout ${readTheme()}`}>
			<Header />
			{children}
			<Footer />
		</div>
	);
};
