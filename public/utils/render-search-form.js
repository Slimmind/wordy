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
			<div id="search-results"></div>
		</div>
  `;
}