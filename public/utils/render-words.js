export default function renderWords(words) {
	const lettersArray = [...new Set(words.map(({ letter }) => letter))].sort();
	const groupedWords = [];
	lettersArray.forEach((letter) =>
		groupedWords.push(words.filter((word) => word.letter === letter))
	);
	const getWordsAmount = () => {
		return !!words.length
			? `<strong class="word__amount">Words: ${words.length}</strong>`
			: null;
	};

	return `
		${getWordsAmount()}
		<nav class="word__navigation">
			<ul class="word__navigation-list">
				${lettersArray
					.map(
						(letter) => `<li  class="word__navigation-list-item">
						<a href="#${letter}">${letter}</a></li>`
					)
					.join('')}
			</ul>
		</nav>
		<ul id="words" class="words">
			${lettersArray
				.map(
					(letter) => `
					<li class="word__group-wrap">
						<ul id="${letter}" class="word__group" data-letter="${letter}">
							${words
								.filter((word) => word.letter === letter)
								.map(
									(word) => `
								<li id="${word.id} "class="word">
									<strong class="word__original" hx-trigger="click" hx-get="/words/${word.id}" hx-target="main">${word.original}</strong>
								</li>
							`
								)
								.join('')}
						</ul>
					</li>
			`
				)
				.join('')}
	</ul>`;
}
