import { useState } from 'react';
import { clsx } from 'clsx';
import { PhraseType, WordDetailType } from '../../utils/constants';
import './phrase.styles.css';

type PhraseProps = {
	data: PhraseType | WordDetailType;
};

export const Phrase = ({ data }: PhraseProps) => {
	const [isTranslationShown, setIsTranslationShown] = useState(false);
	const isPhraseType = 'original' in data;

	const phraseClasses = clsx('phrase', {
		'phrase--with-translation': isPhraseType && data.translation,
	});

	const translationClasses = clsx('phrase__translation', {
		'phrase__translation--shown': isTranslationShown,
	});

	const handleTranslation = () => {
		setIsTranslationShown(!isTranslationShown);
	};

	return 'original' in data ? (
		<li className={phraseClasses} onClick={handleTranslation}>
			{data.original}
			{data.translation && (
				<div className={translationClasses}>{data.translation.value}</div>
			)}
		</li>
	) : (
		<li className='phrase'>{data.value}</li>
	);
};
