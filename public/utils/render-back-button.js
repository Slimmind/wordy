export default function renderBackButton(path = '/words', target = 'main') {
	return `
    <button
      class="circle-btn back-btn"
      aria-label="back button"
      hx-get="${path}"
      hx-target="${target}">
    </button>
  `;
}
