<script>
  import {phrases} from 'stores/phrases'
  import { generateGuid } from 'common/utils'

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


  function onAdd() {
    phrases.set({
      [generateGuid()]: {...newItemForm},
      ...$phrases
    });

    newItemForm.origin = newItemForm.transaction = newItemForm.youtubeLink = '';
  }

</script>

<style>

</style>


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
