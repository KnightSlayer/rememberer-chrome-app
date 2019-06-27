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
    phrases = res.phrases;
  });

  function onAdd() {
    chrome.storage.sync.set({phrases});
  }
</script>

<style>

</style>

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
