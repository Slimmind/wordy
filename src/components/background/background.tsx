export const Background = () => {
	return (
		<div className='background'>
			<img
				src='/bg.webp'
				alt='Background'
				loading='lazy'
				decoding='async'
				width='1920'
				height='1080'
				className='background__image'
			/>
		</div>
	);
};
