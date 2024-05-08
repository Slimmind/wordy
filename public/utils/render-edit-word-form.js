export default function renderEditWordForm({
	id,
	original,
	synonyms,
	translations,
	examples,
}) {
	const renderExamples = () =>
		!!examples?.length
			? examples
					.map(
						(example) =>
							`<textarea name="example" placeholder="example">${example}</textarea>`
					)
					.join('')
			: `<textarea name="example" placeholder="example"></textarea>`;
	return `
		<article id="${id}" class="internal-window word__details">
			<header class="word__details-header"><h2>${original}</h2></header>
			<section class="word__details-body">
				<form id="edit-word-form" class="form" hx-put="/edit-word/${id}" hx-target="main">
					<input
						type="text"
						name="original"
						placeholder="Original word..."
						value="${original}" />
					<textarea
						name="translations"
						placeholder="translation-1, translation-2...">${
							!!translations?.length ? translations.join(', '): ''
						}</textarea>
					<textarea
						name="synonyms"
						placeholder="synonym-1, synonym-2...">${
							!!synonyms?.length ? synonyms.join(', ') : ''
						}</textarea>
          ${renderExamples()}
          <button
            type="button"
            class="add-btn"
            aria-label="add example of word usage"
            hx-get="/add-example"
            hx-swap="beforebegin"
            hx-target="this"
          ></button>
				</form>
			</section>
			<footer class="word__details-footer">
				<button
					class="circle-btn bg-btn delete-btn"
					aria-label="delete word button"
					hx-delete="/words/${id}" hx-target="main"></button>
				<button
					type="submit"
					class="circle-btn apply-btn"
					aria-label="edit word button"
					form="edit-word-form"
				></button>
			</footer>
		</article>
  `;
}
