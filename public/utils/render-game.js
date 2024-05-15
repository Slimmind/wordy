export default function renderGame(words, data) {
	const gameScore = data.score || 0;
	const gameTotal = data.total || 0;
	const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
	const getRandomWord = () => words[getRandomIndex(words)];
	const currentWord = getRandomWord();
	const mainWordVariations = [...currentWord.synonyms, currentWord.original];
	const translationArray = [
		words[getRandomIndex(words)],
		words[getRandomIndex(words)],
		words[getRandomIndex(words)],
	].flatMap(({ translations }) => translations);
	const getRandomVariants = (currentWord) => {
		const currentWordTranslation =
			currentWord.translations.length > 1
				? currentWord.translations.sort(() => Math.random() - 0.5)[0]
				: currentWord.translations[0];
		const variants = [...translationArray].slice(0, 3);
		variants.push(currentWordTranslation);
		return variants.sort(() => Math.random() - 0.5);
	};

	return `
    <div class="internal-window game">
      <header class="game__header">
        <div class="game__score">You know ${gameScore} of ${gameTotal} words</div>
      </header>
      <div class="game__word"><h3>${
				mainWordVariations[getRandomIndex(mainWordVariations)]
			}</h3></div>
      <ul class="game__variants">
        ${getRandomVariants(currentWord)
					.map(
						(variant) =>
							`<li class="game__variants-item">
            <button hx-get="/game" hx-target="main" hx-vals='js:{"wordId": "${currentWord.id}", "score": "${gameScore}", "variant": "${variant}", "total": "${gameTotal}"}'>${variant}</button>
          </li>`
					)
					.join('')}
      </ul>
    </div>
  `;
}
