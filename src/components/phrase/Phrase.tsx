import { useState, lazy } from 'react';
import { clsx } from 'clsx';
import { ItemType, ItemDetailType } from '../../utils/constants';
import { Link } from '@tanstack/react-router';
import { useTts } from 'tts-react';
import './phrase.styles.css';

const Button = lazy(() => import('../button'));

type PhraseProps = {
	data: ItemType | ItemDetailType;
};

export const Phrase = ({ data }: PhraseProps) => {
	const [isTranslationShown, setIsTranslationShown] = useState(false);
	const isPhraseType = 'original' in data;
	const hasTranslations = data.translations && data.translations.length > 0;

	const phraseClasses = clsx('phrase', {
		'phrase--with-translation': hasTranslations,
	});

	const translationClasses = clsx('phrase__translation', {
		'phrase__translation--shown': isTranslationShown,
	});

	const handleTranslation = () => {
		setIsTranslationShown((prev) => !prev);
	};

	const btnActiveClass = isTranslationShown ? 'active' : '';

	const { ttsChildren, state, play } = useTts({
		children: isPhraseType ? data.original : data.value,
		markTextAsSpoken: false,
	});

	const capitalizedTtsChildren = Array.isArray(ttsChildren)
		? ttsChildren.map(item => typeof item === 'string' ? item.charAt(0).toUpperCase() + item.slice(1) : item)
		: typeof ttsChildren === 'string'
			? ttsChildren.charAt(0).toUpperCase() + ttsChildren.slice(1)
			: ttsChildren;

	return (
		<li className={phraseClasses}>
			<header className='phrase__header'>
				<p className='phrase__link-wrap'>
					<Link
						to={`/items/$itemId`}
						params={{ itemId: data.id as string }}
						className='phrase__link'
					>
						{capitalizedTtsChildren}
					</Link>
				</p>
				{hasTranslations && (
					<Button
						aria-label='expand phrase'
						mod='expand'
						activeClass={btnActiveClass}
						onClick={handleTranslation}
					/>
				)}
				<Button
					aria-label='listen to the phrase'
					mod='listen'
					disabled={state.isPlaying}
					onClick={play}
				>
					Listen
				</Button>
			</header>
			<div className='phrase__body'>
				{data.translations && (
					<>
						<div className={translationClasses}>
							{data.translations.map((translation) => (
								<p key={translation.id}>{translation.value}</p>
							))}
						</div>
					</>
				)}
			</div>
		</li>
	);
};
