import { writable } from 'svelte/store';

export const phrases = writable({});


chrome.storage.sync.get('phrases', function(res) {
  phrases.set(res.phrases || {});
});
