import { PropsWithChildren, lazy } from 'react';
import { useTheme } from '../../contexts/theme.context';
import './layout.styles.css';

const MainBackground = lazy(() => import('../main-background'));
const Header = lazy(() => import('../header'));
const Footer = lazy(() => import('../footer'));

export const Layout = ({ children }: PropsWithChildren) => {
	const { readTheme } = useTheme();

	return (
		<div className={`layout layout--${readTheme()}`}>
			<MainBackground />
			<Header />
			{children}
			<Footer />
		</div>
	);
};
