export default function renderSearchResults(results) {
	return results
		.map(
			(result) =>
				`<li id="${result.id} "class="word">
			<strong class="word__original" hx-trigger="click" hx-get="/words/${result.id}" hx-target="main">${result.original}</strong>
		</li>`
		)
		.join('');
}
