export default function renderAlert(alertText) {
  return `
    <div class="word__message word__alert">
      <h3>${alertText}</h3>
      <div class="word__alert-controls">
        <button hx>Cancel</button>
        <button>Delete word</button>
      </div>
    </div>
  `
}