import { useState, lazy } from 'react';
import { clsx } from 'clsx';
import { ItemType, ItemDetailType } from '../../utils/constants';
import './phrase.styles.css';
import { Link } from '@tanstack/react-router';
import { useTts } from 'tts-react';

const Button = lazy(() => import('../button'));

type PhraseProps = {
	data: ItemType | ItemDetailType;
};

export const Phrase = ({ data }: PhraseProps) => {
	const [isTranslationShown, setIsTranslationShown] = useState(false);
	const isPhraseType = 'original' in data;
	const hasTranslations = isPhraseType && data.translations?.length > 0;

	const phraseClasses = clsx('phrase', {
		'phrase--with-translation': isPhraseType && hasTranslations,
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

	return 'original' in data ? (
		<li className={phraseClasses}>
			<header className='phrase__header'>
				<p className='phrase__link-wrap'>
					<Link
						to={`/items/$itemId`}
						params={{ itemId: data.id as string }}
						className='phrase__link'
					>
						{ttsChildren}
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
				{hasTranslations && (
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
	) : (
		<li className='phrase'>
			<p className='phrase__link-wrap'>
				<Link
					to={`/items/$itemId`}
					params={{ itemId: data.wordId as string }}
					className='phrase__link'
				>
					{ttsChildren}
				</Link>
			</p>
			<Button
				aria-label='listen to the phrase'
				mod='listen'
				disabled={state.isPlaying}
				onClick={play}
			>
				Listen
			</Button>
		</li>
	);
};
