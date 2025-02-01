import { PropsWithChildren, lazy } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import getMod from '../../utils/get-mod';
import './internal-window.styles.css';

const Button = lazy(() => import('../button'));

type InternalWindowProps = {
	title?: string;
	mod?: string;
	backUrl?: string;
} & PropsWithChildren;

export const InternalWindow = ({
	mod,
	title,
	backUrl,
	children,
}: InternalWindowProps) => {
	const router = useRouter();
	const onBack = () => router.history.back();

	const internalWindowClasses = clsx('internal-window', {
		[getMod('internal-window', mod)]: mod,
	});

	return (
		<section className={internalWindowClasses}>
			<div className='internal-window__wrapper'>
				<header className='internal-window__header'>
					{backUrl ? (
						<Link
							to={backUrl}
							className='internal-window__back-btn btn--circle btn--back'
						/>
					) : (
						<Button mod='circle back' onClick={onBack} />
					)}
					{title && <h2 className='internal-window__title'>{title}</h2>}
				</header>
				<div className='internal-window__content'>{children}</div>
			</div>
		</section>
	);
};
