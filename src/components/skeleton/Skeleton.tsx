import { useEffect, useState } from 'react';
import './skeleton.styles.css';

type SkeletonProps = {
	delay: number;
};

export const Skeleton = ({ delay }: SkeletonProps) => {
	const [isDelayComplete, setIsDelayComplete] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsDelayComplete(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [delay]);

	if (!isDelayComplete)
		return (
			<div className='skeleton'>
				<div className='skeleton__header'></div>
				<div className='skeleton__body'></div>
				<div className='skeleton__footer'></div>
			</div>
		);

	return null;
};
