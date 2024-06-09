import { PropsWithChildren } from 'react';
import './internal-window.styles.css';
import { Link } from '@tanstack/react-router';

type InternalWindowProps = {
	title?: string;
	mod?: string;
} & PropsWithChildren;

export const InternalWindow = ({
	mod,
	title,
	children,
}: InternalWindowProps) => (
	<section className={`internal-window ${mod}`}>
		<Link to='/' className='internal-window__back-btn btn--circle btn--back' />
		<div className='internal-window__wrapper'>
			{!!title && (
				<header className='internal-window__header'>
					<h2 className='internal-window__title'>{title}</h2>
				</header>
			)}
			<div className='internal-window__content'>{children}</div>
		</div>
	</section>
);
