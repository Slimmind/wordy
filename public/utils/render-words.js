export default function renderWords(words) {
	return `
		<ul id="word-list" class="word__list">
			${words
				.map(
					(word) => `<li id="${word.id}"class="word">
				<strong class="word__original" hx-trigger="click" hx-get="/words/${word.id}" hx-target="main">${word.original}</strong>
			</li>`
				)
				.join('')}
		</ul>
	`;
}
