export default function renderPhrasesList(data) {
  const phrases = data
    .flatMap((word) => word.examples)
    .filter(Boolean);

  const highlightWords = (example) => {
    const exampleWords = [...new Set(example.split(' '))];
    let modifiedExample = example;

    exampleWords.forEach((exampleWord) => {
      const existingWord = data.find((word) => word.original.toLowerCase() === exampleWord.toLowerCase());

      if (existingWord) {
        modifiedExample = modifiedExample.replace(
          new RegExp(existingWord.original, 'gi'),
          (match) => `<u class="word--existing" hx-trigger="click" hx-get="/words/${existingWord.id}" hx-target="main">${match}</u>`
        );
      }
    });

    return modifiedExample;
  };

  const phrasesHTML = phrases.map((phrase) => `<li class="phrase block">${highlightWords(phrase)}</li>`).join('');

  return `
    <div class="internal-window">
      <ul class="phrases">
        ${phrasesHTML}
      </ul>
    </div>
  `;
}
