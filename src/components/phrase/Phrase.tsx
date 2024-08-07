import { useState } from 'react';
import { clsx } from 'clsx';
import { PhraseType, WordDetailType } from '../../utils/constants';
import Button from '../button';
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
		setIsTranslationShown(prev => !prev);
	};

  const btnActiveClass = isTranslationShown ? 'active' : '';

	return 'original' in data ? (
		<li className={phraseClasses}>
			{data.original}
			{data.translation && (
        <>
          <Button
            aria-label='expand phrase'
            mod="expand"
            extraClass={btnActiveClass}
            onClick={handleTranslation}
          />
          <div className={translationClasses}>{data.translation.value}</div>
        </>
			)}
		</li>
	) : (
		<li className='phrase'>{data.value}</li>
	);
};
