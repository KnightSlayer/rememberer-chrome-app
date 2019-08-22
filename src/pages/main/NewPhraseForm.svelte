<script>
  import {phrases} from 'stores/phrases'

  const newItemForm = {
    origin: '',
    translation: '',
    youtubeLink: '',
    highlights: [
      /*
            {
              origin: [{from: 54, length: 14} ],
              translation: [{from: 51, length: 9} ],
              color: 21,
            }

      */
    ]
  };


  function onAdd() {
    phrases.add(newItemForm);

    newItemForm.origin = newItemForm.translation = newItemForm.youtubeLink = '';
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
    <textarea bind:value={newItemForm.translation}></textarea>
  </label>
  <label>
    Youtube Time Link:
    <input bind:value={newItemForm.youtubeLink}>
  </label>

  <button> Add new phrase </button>
</form>
