import { useState } from 'react';
import { clsx } from 'clsx';
import { ItemType, ItemDetailType } from '../../utils/constants';
import Button from '../button';
import './phrase.styles.css';
import { Link } from '@tanstack/react-router';

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
		setIsTranslationShown(prev => !prev);
	};

  const btnActiveClass = isTranslationShown ? 'active' : '';

	return 'original' in data ? (
		<li className={phraseClasses}>
      <Link to={`/items/$itemId`} params={{ itemId: data.id as string }}>
        {data.original}
			</Link>
			{hasTranslations && (
        <>
          <Button
            aria-label='expand phrase'
            mod="expand"
            activeClass={btnActiveClass}
            onClick={handleTranslation}
          />
          <div className={translationClasses}>
            {data.translations.map((translation) => <p key={translation.id}>{translation.value}</p>)}
          </div>
        </>
			)}
		</li>
	) : (
		<li className='phrase'>
      <Link to={`/items/$itemId`} params={{ itemId: data.id as string }}>
        {data.value}
			</Link>
    </li>
	);
};
