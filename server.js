import express from 'express';
import bodyParser from 'body-parser';
import renderWords from './public/utils/render-words.js';
import renderBackButton from './public/utils/render-back-button.js';
import readData from './public/utils/read-data.js';
import writeData from './public/utils/write-data.js';
import renderMessage from './public/utils/render-message.js';
import renderWordDetails from './public/utils/render-word-details.js';
import renderEditWordForm from './public/utils/render-edit-word-form.js';
import renderSearchForm from './public/utils/render-search-form.js';

const appData = readData() || [];
console.log('DATA: ', appData);

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>WORDY</title>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="https://fonts.googleapis.com/css2?family=Jersey+10&family=Jersey+10+Charted&family=Kode+Mono:wght@400..700&display=swap" rel="stylesheet">
			<link rel="icon" href="/icon.png" />
			<link rel="stylesheet" href="/main.css" />
			<link rel="manifest" href="/manifest.json">
			<script src="/htmx.js" defer></script>
		</head>

		<body>
    <header class="main-header">
      <h1>Wordy</h1>
    </header>
			<main hx-swap="innerHTML">
				<ul id="words" hx-get="/words" hx-trigger="load"></ul>
			</main>
			<footer>
				<button class="circle-btn search-btn" aria-label="search button" hx-get="/search" hx-target="main"></button>
				<button class="circle-btn menu-btn" aria-label="open application menu"></button>
				<button class="circle-btn add-btn" aria-label="add word button" hx-get="/add-word" hx-target="main"></button>
			</footer>
		</body>
		</html>
	`);
});

app.get('/words', (req, res) => {
	res.send(renderWords(appData));
});

app.get('/words/:id', (req, res) => {
	const word = appData.find((word) => word.id === req.params.id);

	res.send(`
    ${renderBackButton()}
		${renderWordDetails(word)}
	`);
});

app.get('/edit-word/:id', (req, res) => {
	const wordToEdit = appData.find(
		(word) => word.id === req.params.id
	);

	res.send(`
    ${renderBackButton()}
    ${renderEditWordForm(wordToEdit)}
  `);
});

app.put('/edit-word/:id', (req, res) => {
	const { id } = req.params;
	const { original, translations } = req.body;

	const editingWordIndex = appData.findIndex((word) => word.id === id);

	const updatedWord = {
		id,
		original,
		translations: translations.split(', '),
	};

	appData[editingWordIndex] = updatedWord;
	writeData(appData);

	res.status(200).send(renderWords(appData));
});

app.delete('/words/:id', (req, res) => {
	const filteredWords = appData.filter((word) => word.id !== req.params.id);
	writeData(filteredWords);
	res.send(renderWords(filteredWords));
});

app.get('/add-word', (req, res) => {
	res.send(`
    ${renderBackButton()}
		<div class="internal-window">
			<form hx-post="/add-word" hx-target="main">
				<input type="text" name="original" placeholder="Original word..." />
				<textarea name="translations" placeholder="translaion-1, translation-2..."></textarea>
				<button type="submit">Submit</button>
			</form>
		</div>
	`);
});

app.post('/add-word', (req, res) => {
	const newWord = {
		id: Date.now().toString(),
		original: req.body.original.toLowerCase(),
		translations:
			req.body.translations
				.split(',')
				.map((translation) => translation.toLowerCase()) ||
			req.body.translations.toLowerCase(),
	};

	const isNewWordAlreadyExist = appData.find(
		(word) => word.original === newWord.original
	);

	if (isNewWordAlreadyExist) {
		return res.send(
			`
			${renderBackButton()}
			<div class="internal-window">
				${renderMessage(['This word is already exist :0', 'Try to add a new one ;)'])}
			</div>
		`
		);
	}

	appData.push(newWord);
	writeData(appData);

	res.send(renderWords(appData));
});

app.get('/search', (req, res) => {
	res.send(`
    ${renderBackButton()}
		${renderSearchForm()}
	`);
});

app.post('/search', (req, res) => {
	const searchTerm = req.body.search.toLowerCase();
	let searchResults;

	if (searchTerm) {
		searchResults = appData.filter((word) =>
			word.original.startsWith(searchTerm)
		);
		return res.send(renderWords(searchResults));
	}

	return res.send();
});

app.listen(3000);
