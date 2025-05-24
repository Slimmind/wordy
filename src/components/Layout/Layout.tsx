import { PropsWithChildren, lazy } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './layout.styles.css';

const MainBackground = lazy(() => import('../main-background'));
const Header = lazy(() => import('../header'));
const Footer = lazy(() => import('../footer'));

export const Layout = ({ children }: PropsWithChildren) => {
  const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<div className={`layout layout--${theme}`}>
			<MainBackground />
			<Header />
			{children}
			<Footer />
		</div>
	);
};
