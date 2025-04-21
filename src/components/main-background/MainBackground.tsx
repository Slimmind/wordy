import { memo } from 'react';
import './main-background.styles.css';

const BACKGROUND_CLASS = 'main-background';
const IMAGE_CLASS = 'main-background__image';
const IMAGE_SRC = '/bg.png';
const IMAGE_ALT = 'Background';
const IMAGE_WIDTH = '1024';
const IMAGE_HEIGHT = '1024';

export const MainBackground = memo(() => {
	return (
		<div className={BACKGROUND_CLASS} role='presentation'>
			<img
				src={IMAGE_SRC}
				alt={IMAGE_ALT}
				loading='lazy'
				decoding='async'
				width={IMAGE_WIDTH}
				height={IMAGE_HEIGHT}
				className={IMAGE_CLASS}
				fetchPriority='low'
			/>
		</div>
	);
});

MainBackground.displayName = 'MainBackground';
