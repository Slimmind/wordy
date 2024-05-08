export default function renderFooter() {
	return `
		<footer class="main-footer">
			<button class="circle-btn search-btn" aria-label="search button" hx-get="/search" hx-target="main"></button>
			<button class="circle-btn phrases-btn" aria-label="phrases button" hx-get="/phrases" hx-target="main"></button>
			<button class="circle-btn add-btn" aria-label="add word button" hx-get="/add-word" hx-target="main"></button>
		</footer>
	`;
}
