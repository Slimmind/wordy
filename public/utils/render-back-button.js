export default function renderBackButton(path = '/words', target = 'main') {
	return `
    <button
      class="btn--circle btn--back"
      aria-label="back button"
      hx-get="${path}"
      hx-target="${target}">
    </button>
  `;
}
