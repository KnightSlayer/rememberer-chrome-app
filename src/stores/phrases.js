import { writable } from 'svelte/store';
import { generateGuid } from 'common/utils'


export const getBlankPhrase = () => ({
  origin: '',
  translation: '',
  videoId: null,
  time: null,
  duration: 10,
  highlights: [
      // {
      //   origin: {from: 54, length: 14},
      //   translation: {from: 51, length: 9},
      //   color: 21,
      //   id: uuid,
      // },
  ],
  actions: {
    back: [],
    forward: [],
  },
});

const phraseActions = {
  ADD_HIGHLIGHT: 'ADD_HIGHLIGHT',
};

function createPhrases() {
  const { subscribe, set, update } = writable({});


  const addAction = (phrase, action) => {
    const newHl = {
      ...phrase,
      actions: {
        ...phrase.actions,
        forward: [],
      },
    };

    if (newHl.actions.back.length > 9) {
      newHl.actions.back = newHl.actions.back.slice(-9);
    }
    newHl.actions.back.push(action);

    return newHl;
  };

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
      const newHl = {
        ...highlight,
        id: generateGuid(),
      };
      const newPhrases = {
        ...phrases,
        [id]: {
          ...phrases[id],
          highlights: [...phrases[id].highlights, newHl],
        },
      };
      newPhrases[id] = addAction(newPhrases[id], {type: phraseActions.ADD_HIGHLIGHT, payload: newHl});

      chrome.storage.sync.set({phrases: newPhrases});
      return newPhrases;
    }),
    back: (id) => update(phrases => {
      if (!phrases[id].actions.back.length) return phrases;

      const newPhrases = {
        ...phrases,
        [id]: {
          ...phrases[id],
        },
      };

      const back = [...newPhrases[id].actions.back];
      const targetAction = back.pop();
      newPhrases[id].actions = {
        back,
        forward: [...newPhrases[id].actions.forward, targetAction],
      };

      switch (targetAction.type) {
        case phraseActions.ADD_HIGHLIGHT: {
          newPhrases[id].highlights = newPhrases[id].highlights.filter(hl => hl.id != targetAction.payload.id);
          break;
        }
      }

      chrome.storage.sync.set({phrases: newPhrases});
      return newPhrases;
    }),
    forward: (id) => update(phrases => {
      if (!phrases[id].actions.forward.length) return phrases;

      const newPhrases = {
        ...phrases,
        [id]: {
          ...phrases[id],
        },
      };

      const forward = [...newPhrases[id].actions.forward];
      const targetAction = forward.pop();
      newPhrases[id].actions = {
        forward,
        back: [...newPhrases[id].actions.back, targetAction],
      };

      switch (targetAction.type) {
        case phraseActions.ADD_HIGHLIGHT: {
          newPhrases[id].highlights = [...newPhrases[id].highlights, targetAction.payload];
          break;
        }
      }

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
