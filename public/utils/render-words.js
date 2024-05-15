export default function renderWords(data, req) {
	const lettersArray = [
		...new Set(data.words.map(({ letter }) => letter)),
	].sort();

	const getWordsAmount = () => {
		return data.words.length
			? `<strong class="word__amount">Words: ${data.words.length}</strong>`
			: '';
	};

	const generateNavigationList = () => {
		return lettersArray
			.map(
				(letter) =>
					`<li class="word__navigation-list-item">
            <a href="#${letter}">${letter}</a>
          </li>`
			)
			.join('');
	};

	const generateGroupedWords = () => {
		return lettersArray
			.map(
				(letter) => `
          <li class="word__group-wrap">
            <ul id="${letter}" class="word__group" data-letter="${letter}">
              ${data.words
								.filter((word) => word.letter === letter)
								.map(
									(word) => `
                  <li id="${word.id}" class="word">
                    <strong class="word__original" hx-trigger="click" hx-get="/words/${word.id}" hx-target="main">
                      ${word.original}
                    </strong>
                  </li>
                `
								)
								.join('')}
            </ul>
          </li>
        `
			)
			.join('');
	};

	return `
    ${getWordsAmount()}
    <nav class="word__navigation">
      <ul class="word__navigation-list">
        ${generateNavigationList()}
      </ul>
    </nav>
    <ul id="words" class="words">
      ${generateGroupedWords()}
    </ul>
  `;
}
