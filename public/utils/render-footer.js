export default function renderFooter() {
	return `
		<footer class="main-footer">
			<button class="circle-btn search-btn" aria-label="search button" hx-get="/search" hx-target="main"></button>

			<button class="circle-btn add-btn" aria-label="add word button" hx-get="/add-word" hx-target="main"></button>
		</footer>
	`;
}

// <button class="circle-btn menu-btn" aria-label="open menu button" hx-get="/main-menu" hx-target=".main-footer" hx-swap="afterbegin"></button>
