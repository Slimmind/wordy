export default function renderFooter() {
	return `
		<footer class="main-footer">
			<button class="btn--circle btn--search" aria-label="search button" hx-get="/search" hx-target="main"></button>
			<button class="btn--circle btn--menu" aria-label="phrases button" hx-get="/menu" hx-target="main"></button>
			<button class="btn--circle btn--add" aria-label="add word button" hx-get="/add-word" hx-target="main"></button>
		</footer>
	`;
}
