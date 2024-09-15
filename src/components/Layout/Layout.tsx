import { PropsWithChildren, lazy, Suspense } from 'react';
import { useTheme } from '../../contexts/theme.context';
import './layout.styles.css';

// Lazy-loaded components
const Header = lazy(() => import('../header'));
const Footer = lazy(() => import('../footer'));

// Preloader component (import or define your own)
import Preloader from '../preloader';

export const Layout = ({ children }: PropsWithChildren) => {
	const { readTheme } = useTheme();

	return (
		<Suspense fallback={<Preloader />}>
			<div className={`layout layout--${readTheme()}`}>
				<Header />
				{children}
				<Footer />
			</div>
		</Suspense>
	);
};
