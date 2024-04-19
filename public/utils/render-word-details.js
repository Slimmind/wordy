export default function renderWordDetails(word) {
	return `
		<article id="${word.id}" class="internal-window word__details">
			<header class="word__details-header"><h2>${word.original}</h2></header>
			<section class="word__details-body" id="word-body">
				<div class="word__details-translations block">
          <h3 class="title">Translations: </h3>
					<ul class="word__details-translations-list">${word.translations
						.map(
							(translation) =>
								`<li class="word__translations-list-item">${translation}</li>`
						)
						.join('')}
					</ul>
				</div>
			</section>
			<footer class="word__details-footer">
				<button
					class="circle-btn bg-btn delete-btn"
					aria-label="delete word button"
					hx-delete="/words/${word.id}" hx-target="main"></button>
				<button
					class="circle-btn bg-btn edit-btn"
					aria-label="edit word button"
					hx-get="edit-word/${word.id}"
					hx-target="#word-body"></button>
			</footer>
		</article>
	`;
}
