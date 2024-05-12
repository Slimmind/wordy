export default function renderWordDetails(words, currentWord) {
	const highlightWords = (example) => {
		const exampleWords = [...new Set(example.split(' '))];
		let modifiedExample = example;

		exampleWords.forEach((exampleWord) => {
      const existingWord = words.find((word) => word.original.toLowerCase() === exampleWord.toLowerCase());
      
      if (existingWord) {
        modifiedExample = modifiedExample.replace(
          new RegExp(existingWord.original, 'gi'),
          (match) => {
            const highlighted = existingWord.original === currentWord.original
              ? `<strong>${match}</strong>`
              : `<u class="word--existing" hx-trigger="click" hx-get="/words/${existingWord.id}" hx-target="main">${match}</u>`;
            
            return highlighted;
          }
        );
      }
    });

		return modifiedExample;
	};

  const renderTranslations = (translations) => {
    if (!!translations?.length) {
      const preparedTranslations = translations.filter((item) => item !== '');
      return `
        <div class="word__details-translations block">
          <h3 class="block__title">Translations: </h3>
          <ul class="word__details-list marker">${preparedTranslations
            .map(
              (translation) =>
                `<li class="word__details-list-item">${translation.trim()}</li>`
            )
            .join('')}
          </ul>
        </div>
      `;
    }

    return '';
  }

	const renderSynonyms = (synonyms) => {
    if (!!synonyms?.length) {
      const preparedSynonyms = synonyms.filter((item) => item !== '');
      return `
        <div class="word__details-synonyms block">
          <h3 class="block__title">Synonyms: </h3>
          <ul class="word__details-list marker">${preparedSynonyms
            .map(
              (synonym) =>
                `<li class="word__details-list-item">${highlightWords(
                  synonym.trim()
                )}</li>`
            )
            .join('')}
          </ul>
        </div>
      `;
    }

    return '';
	};

	const renderExamples = (examples) => {
    if (!!examples?.length) {
      const preparedExamples = examples.filter((item) => item !== '');
      return `
        <div class="word__details-examples block">
          <h3 class="block__title">Examples: </h3>
          <ul class="word__details-examples-list marker">${preparedExamples
            .map(
              (example) =>
                `<li class="word__examples-list-item">${highlightWords(
                  example.trim()
                )}</li>`
            )
            .join('')}
          </ul>
        </div>
      `;
    }

    return '';
	};

	return `
		<article id="${currentWord.id}" class="internal-window word__details">
			<header class="word__details-header"><h2>${currentWord.original}</h2></header>
			<section class="word__details-body" id="word-body">
				${renderTranslations(currentWord.translations)}
        ${renderSynonyms(currentWord.synonyms)}
				${renderExamples(currentWord.examples)}
			</section>
			<footer class="word__details-footer">
				<button
					class="btn--circle btn--bg btn--delete"
					aria-label="delete word button"
          hx-confirm="Are you sure want to delete this word?"
					hx-delete="/words/${currentWord.id}" hx-target="main"></button>
				<button
					class="btn--circle btn--bg btn--edit"
					aria-label="edit word button"
					hx-get="edit-word/${currentWord.id}"
					hx-target="main"></button>
			</footer>
		</article>
	`;
}
