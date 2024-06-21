import { PropsWithChildren } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import getMod from '../../utils/get-mod';
import './internal-window.styles.css';
import Button from '../button';

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
	return (
		<section
			className={`internal-window ${mod && getMod('internal-window', mod)}`}
		>
			{backUrl ? (
				<Link
					to={backUrl}
					className='internal-window__back-btn btn--circle btn--back'
				/>
			) : (
				<Button mod='circle back' onClick={onBack} />
			)}
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
};
