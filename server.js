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
import getExamples from './public/utils/get-examples.js';
import renderFooter from './public/utils/render-footer.js';
import renderSearchResults from './public/utils/render-search-results.js';
import renderHeader from './public/utils/render-header.js';
import sanitizeValue from './public/utils/sanitize-value.js';
import renderPhrasesList from './public/utils/render-phrases-list.js';
import renderMainMenu from './public/utils/render-main-menu.js';
import renderGame from './public/utils/render-game.js';

const appData = readData() || [];

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
			${renderHeader()}
			<main hx-swap="innerHTML" hx-get="/words" hx-trigger="load"></main>
			${renderFooter()}
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
		${renderWordDetails(appData, word)}
	`);
});

app.get('/edit-word/:id', (req, res) => {
	const wordToEdit = appData.find((word) => word.id === req.params.id);

	res.send(`
    ${renderBackButton()}
    ${renderEditWordForm(wordToEdit)}
  `);
});

app.put('/edit-word/:id', (req, res) => {
	const { id } = req.params;
	const { original, translations, synonyms } = req.body;
	const editingWordIndex = appData.findIndex((word) => word.id === id);
	const letter = sanitizeValue(original.charAt(0));
  const updatedOriginal = sanitizeValue(original);
  const updatedTranslations = sanitizeValue(translations.split(', '));
  const updatedSynonyms = sanitizeValue(synonyms.split(', '));

	const updatedWord = {
		...appData[editingWordIndex],
		letter,
		original: updatedOriginal,
		translations: updatedTranslations,
		synonyms: updatedSynonyms,
		examples: getExamples(req.body),
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
			<form class="form add-word" hx-post="/add-word" hx-target="main">
				<input type="text" name="original" placeholder="Original word..." />
				<textarea name="translations" placeholder="translation-1, translation-2..."></textarea>
				<textarea name="synonyms" placeholder="synonym-1, synonym-2..."></textarea>
				<textarea name="example" placeholder="example"></textarea>
				<button
					type="button"
					class="btn--add"
					aria-label="add example of word usage"
					hx-get="/add-example"
					hx-swap="beforebegin"
					hx-target="this"
				></button>
				<button type="submit">Submit</button>
			</form>
		</div>
	`);
});

app.post('/add-word', (req, res) => {
	const newWord = {
		id: Date.now().toString(),
		letter: sanitizeValue(req.body.original).charAt(0),
		original: sanitizeValue(req.body.original),
		translations: sanitizeValue(req.body.translations.split(',')),
		synonyms: sanitizeValue(req.body.synonyms.split(',')),
		examples: getExamples(req.body),
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

app.get('/add-example', (req, res) => {
	res.send(
		`<textarea name="example-${Date.now()}" placeholder="example"></textarea>`
	);
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
		return res.send(renderSearchResults(searchResults));
	}

	return res.send();
});

app.get('/menu', (req ,res) => {
  res.send(renderMainMenu());
});

app.get('/phrases', (req, res) => {
  res.send(`
    ${renderBackButton()}
    ${renderPhrasesList(appData)}
  `);
});

app.get('/game', (req, res) => {
  res.send(`
    ${renderBackButton()}
    ${renderGame()}
  `);
});

app.listen(3000);
