import { writable } from 'svelte/store';
import { generateGuid } from 'common/utils'


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
  };
}

export const phrases = createPhrases();
