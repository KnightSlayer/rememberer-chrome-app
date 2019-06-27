<script>
  import { generateGuid } from 'common/utils'

  const newItemForm = {
    origin: '',
    transaction: '',
    youtubeLink: '',
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
        selections: [],
      }
    };
    chrome.storage.sync.set({phrases});

    newItemForm.origin = newItemForm.transaction = newItemForm.youtubeLink = '';
  }
</script>

<style>

</style>

<div>
  <form on:submit|preventDefault={onAdd}>
    <label>
      Origin:
      <textarea bind:value={newItemForm.origin}/>
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

  <ul>
  {#each prhasesIds as phraseId}
    <li>
      <div> {phrases[phraseId].origin} </div>
      <div> {phrases[phraseId].transaction} </div>
      <div> {phrases[phraseId].youtubeLink} </div>
    </li>
  {/each}
  </ul>
</div>
