import { writable } from 'svelte/store';
import { generateGuid } from 'common/utils'

/*
    const newItemForm = {
      origin: '',
      translation: '',
      youtubeLink: '',
      highlights: [
          {
            origin: {from: 54, length: 14},
            translation: {from: 51, length: 9},
            color: 21,
          },
      ],
    };
*/

function createPhrases() {
  const { subscribe, set, update } = writable({});

  chrome.storage.sync.get('phrases', function(res) {
    console.log('phrases sync', res.phrases);
    set(res.phrases || {});
  });

  return {
    subscribe,
    add: (phrase) => update(phrases => {
      const newPhrases = {
        [generateGuid()]: {...phrase},
        ...phrases,
      };

      chrome.storage.sync.set({phrases: newPhrases});

      return newPhrases;
    }),
    delete: (id) => update(phrases => {
      const newPhrases = {...phrases};
      delete newPhrases[id];

      chrome.storage.sync.set({phrases: newPhrases});

      return newPhrases;
    }),
    addHighlight: (id, highlight) => update(phrases => {
      // TODO: validate
      const newPhrases = {
        ...phrases,
        [id]: {
          ...phrases[id],
          highlights: [...phrases[id].highlights, highlight],
        },
      };

      chrome.storage.sync.set({phrases: newPhrases});
      return newPhrases;
    }),
  };
}

export const phrases = createPhrases();

export const sortHighlights = (highlights) => {
  const separatedHighlights = highlights.reduce((acc, hl) => {
    acc.origin.push({
      ...hl.origin,
      color: hl.color,
    });

    acc.translation.push({
      ...hl.translation,
      color: hl.color,
    });

    return acc;
  }, {origin:[],translation:[]});

  // TODO: нужна ли сортировка именно тут???
  separatedHighlights.origin.sort((a, b) => a.from - b.from);
  separatedHighlights.translation.sort((a, b) => a.from - b.from);

  return separatedHighlights;
};

export default phrases
