export default function renderMessage(messages) {
	return `
		<div class="word__message">
			${messages.map((message) => `<p>${message}</p>`).join('')}
		</div>
	`;
}
