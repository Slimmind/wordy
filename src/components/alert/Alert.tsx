import { useState, useEffect, PropsWithChildren } from 'react';
import './alert.styles.css';

type AlertProps = {
	shown: boolean;
	type?: 'info' | 'error';
	mod?: 'inline' | 'global';
	title?: string;
	duration?: number;
} & PropsWithChildren;

export const Alert = ({
	shown,
	type,
	mod = 'inline',
	title,
	duration,
	children,
}: AlertProps) => {
	const [isVisible, setIsVisible] = useState(shown);

	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [duration]);

	if (!isVisible) {
		return null;
	}

	return (
		<div className={`alert alert--${type} alert--${mod}`}>
			{title && <h3 className='alert__title'>{title}</h3>}
			{children}
		</div>
	);
};
