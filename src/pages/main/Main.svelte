<script>
  import { generateGuid } from 'common/utils'
  import Phrase from './Phrase.svelte';

  const newItemForm = {
    origin: '',
    transaction: '',
    youtubeLink: '',
    highlights: [
/*
      {
        origin: [{from: 54, length: 14} ],
        transaction: [{from: 51, length: 9} ],
        color: 21,
      }

*/
    ]
  };

  let phrases = {};

  $: prhasesIds = Object.keys(phrases);

  chrome.storage.sync.get('phrases', function(res) {
    phrases = res.phrases || {};
    console.log('phrases', phrases)
  });

  function onAdd() {
    phrases = {
      ...phrases,
      [generateGuid()]: {
        ...newItemForm,
      }
    };
    chrome.storage.sync.set({phrases});

    newItemForm.origin = newItemForm.transaction = newItemForm.youtubeLink = '';
  }
</script>

<style>
  .ul {
    margin: 0.5em auto 0 auto;
    padding: 0;

    max-width: 88em;
  }
</style>

<div>
  <form on:submit|preventDefault={onAdd}>
    <label>
      Origin:
      <textarea bind:value={newItemForm.origin}></textarea>
    </label>
    <label>
      Translation:
      <textarea bind:value={newItemForm.transaction}></textarea>
    </label>
    <label>
      Youtube Time Link:
      <input bind:value={newItemForm.youtubeLink}>
    </label>

    <button> Add new phrase </button>
  </form>

  <ul class="ul">
  {#each prhasesIds as phraseId}
    <Phrase phraseId={phraseId} phrase={phrases[phraseId]}/>
  {/each}
  </ul>
</div>
