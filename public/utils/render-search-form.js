export default function renderSearchForm() {
	return `
    <div class="internal-window">
			<form>
				<input
					type="search"
					name="search"
					placeholder="Search word..."
					hx-trigger="input"
					hx-post="/search"
					hx-target="#search-results"
				/>
			</form>
			<ul id="search-results"></ul>
		</div>
  `;
}
