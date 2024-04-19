export default function renderEditWordForm({ id, original, translations }) {
  return `
    <form hx-put="/edit-word/${id}" hx-target="main">
      <input
        type="text"
        name="original"
        placeholder="Original word..."
        value="${original}" />
      <textarea
        name="translations"
        placeholder="translation-1, translation-2...">${translations.join(
          ', '
        )}</textarea>
      <button type="submit">Submit</button>
    </form>
  `;
}