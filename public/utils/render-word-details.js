export default function renderWordDetails(words, currentWord) {
	// const highlightCurrentWord = (str) =>
	// 	str.replace(
	// 		new RegExp(currentWord.original, 'gi'),
	// 		(match) => `<strong>${match}</strong>`
	// 	);

  const highlightWords = (example) => {
    const exampleWords = [... new Set(example.split(' '))].filter((exampleWord) => currentWord !== exampleWord);
    const existingWords = exampleWords.map((exampleWord) => words.find((word) => word.original === exampleWord));
    console.log('TEST: ', existingWords);

    existingWords.forEach((existingWord) => {
      return example.replace(
        new RegExp(existingWord, 'gi'),
        (match) => `${existingWord === currentWord.original ? `<strong>${match}</strong>` : `<u>${match}</u>`}`
      );
    });
  }

  const renderSynonyms = (synonyms) => {
    return `
      <div class="word__details-synonyms block">
        <h3 class="title">Synonyms: </h3>
        <ul class="word__details-list marker">${synonyms
          .map(
            (synonym) =>
              `<li class="word__details-list-item">${synonym}</li>`
          )
          .join('')}
        </ul>
      </div>
    `;
  }

	const renderExamples = (examples) => {
		return `
			<div class="word__details-examples block">
				<h3 class="title">Examples: </h3>
				<ul class="word__details-examples-list marker">${examples
					.map(
						(example) =>
							`<li class="word__examples-list-item">${highlightWords(
								example
							)}</li>`
					)
					.join('')}
				</ul>
			</div>
		`;
	};

	return `
		<article id="${currentWord.id}" class="internal-window word__details">
			<header class="word__details-header"><h2>${currentWord.original}</h2></header>
			<section class="word__details-body" id="word-body">
				<div class="word__details-translations block">
          <h3 class="title">Translations: </h3>
					<ul class="word__details-list marker">${currentWord?.translations
						.map(
							(translation) =>
								`<li class="word__details-list-item">${translation}</li>`
						)
						.join('')}
					</ul>
				</div>
        ${!!currentWord?.synonyms?.length ? renderSynonyms(currentWord.synonyms) : ''}
				${!!currentWord?.examples?.length ? renderExamples(currentWord.examples) : ''}
			</section>
			<footer class="word__details-footer">
				<button
					class="circle-btn bg-btn delete-btn"
					aria-label="delete word button"
          hx-confirm="Are you sure want to delete this word?"
					hx-delete="/words/${currentWord.id}" hx-target="main"></button>
				<button
					class="circle-btn bg-btn edit-btn"
					aria-label="edit word button"
					hx-get="edit-word/${currentWord.id}"
					hx-target="main"></button>
			</footer>
		</article>
	`;
}
