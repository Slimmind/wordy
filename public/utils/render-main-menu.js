export default function renderMainMenu() {
	return `
    <nav class="main-menu">
      <ul class="main-menu__list">
        <li class="main-menu__item" hx-get="/phrases" hx-target="main"><button>Phrases</button></li>
        <li class="main-menu__item" hx-get="/game" hx-target="main"><button>Play Game</button></li>
        <li class="main-menu__item" hx-get="/switch-theme" hx-target="main"><button>Toggle Global Theme</button></li>
      </ul>
    </nav>
  `;
}
